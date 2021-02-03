export const DOM_SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const DOM_HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
export const DOM_XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

export enum NS {
  HTML = 0,
  SVG = 1,
}

export function nsFromNode(node: Node): NS {
  return childSpace(node.namespaceURI === DOM_SVG_NAMESPACE ? NS.SVG : NS.HTML, node.nodeName);
}

export function childSpace(ns: NS, nodeName: string): NS {
  if (ns === NS.SVG && nodeName !== 'foreignObject') return NS.SVG;
  return NS.HTML;
}

export function nsToNode(ns: NS): typeof DOM_SVG_NAMESPACE | typeof DOM_HTML_NAMESPACE {
  if (ns === NS.SVG) return DOM_SVG_NAMESPACE;
  return DOM_HTML_NAMESPACE;
}
