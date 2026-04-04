import type { ElementFiber, FunctionComponentFiber, SignalFiber } from '../fiber';
import type { AttributeSignalContext, ChildSignalContext } from '../signals';

import { rediffComponent, rediffSignalChild } from './diff-tree';
import { rediffProp } from './prop';
import { assert } from '../util/assert';

export enum WorkItemEnum {
  COMPONENT,
  CHILD,
  PROP,
}

export interface ComponentWorkItem {
  type: WorkItemEnum.COMPONENT;
  depth: number;
  fiber: FunctionComponentFiber;
  context: null;
}

export interface ChildWorkItem {
  type: WorkItemEnum.CHILD;
  depth: number;
  fiber: SignalFiber;
  context: null;
}

export interface PropWorkItem {
  type: WorkItemEnum.PROP;
  depth: number;
  fiber: ElementFiber;
  context: AttributeSignalContext;
}

export type WorkItem = ComponentWorkItem | ChildWorkItem | PropWorkItem;

let resolved: Promise<void>;
let diffs: WorkItem[] = [];
let scheduling = true;

export function enqueueWork(scheduler: typeof nextTick, item: WorkItem): void {
  const { fiber } = item;

  if (fiber.dirty || !fiber.mounted) return;
  if (item.type === WorkItemEnum.COMPONENT) fiber.dirty = true;
  if (fiber.current) return;

  const length = diffs.push(item);
  if (length === 1 && scheduling) scheduler(process);
}

export function enqueueDiff(fiber: FunctionComponentFiber): void {
  enqueueWork(nextTick, {
    type: WorkItemEnum.COMPONENT,
    depth: fiber.depth,
    fiber,
    context: null,
  });
}

export function enqueueSignalChild(child: ChildSignalContext): void {
  const { fiber } = child;
  enqueueWork(nextTick, {
    type: WorkItemEnum.CHILD,
    depth: fiber.depth,
    fiber,
    context: null,
  });
}

export function enqueueProp(context: AttributeSignalContext): void {
  const { fiber } = context;
  enqueueWork(nextTick, {
    type: WorkItemEnum.PROP,
    depth: fiber.depth,
    fiber,
    context,
  });
}

export function process(): boolean {
  if (diffs.length === 0) return false;
  while (diffs.length > 0) {
    const scheduled = diffs.sort((a, b) => a.depth - b.depth);
    diffs = [];
    for (let i = 0; i < scheduled.length; i++) {
      const { type, fiber, context } = scheduled[i];
      if (!fiber.mounted) continue;

      if (type === WorkItemEnum.COMPONENT) {
        if (!fiber.dirty) continue;
        rediffComponent(fiber);
      } else if (type === WorkItemEnum.CHILD) {
        debug: assert(fiber.signalContext.active, 'active because signal fiber is still mounted');
        rediffSignalChild(fiber);
      } else if (type === WorkItemEnum.PROP) {
        if (!context.active) continue;
        rediffProp(context);
      }
    }
  }
  return true;
}

export function skipScheduling(skip: boolean): void {
  scheduling = !skip;
}

// istanbul ignore next
function nextTick(process: () => void): void {
  (resolved ||= Promise.resolve()).then(process);
}
