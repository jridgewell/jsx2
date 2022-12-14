export const DOM_SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const DOM_HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
export const DOM_XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

export const NS_HTML = 0;
export const NS_SVG = 1;
export type NS = typeof NS_HTML | typeof NS_SVG;

export function nsFromNode(node: Node): NS {
  return childSpace(
    (node as any).namespaceURI === DOM_SVG_NAMESPACE ? NS_SVG : NS_HTML,
    node.nodeName,
  );
}

export function childSpace(ns: NS, nodeName: string): NS {
  if (ns === NS_SVG && nodeName !== 'foreignObject') return NS_SVG;
  return NS_HTML;
}

export function nsToNode(ns: NS): typeof DOM_SVG_NAMESPACE | typeof DOM_HTML_NAMESPACE {
  if (ns === NS_SVG) return DOM_SVG_NAMESPACE;
  return DOM_HTML_NAMESPACE;
}
