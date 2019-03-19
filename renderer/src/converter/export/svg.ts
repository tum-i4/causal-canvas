

export function svgExport(svg: SVGSVGElement | null): string {
    if (svg === null) {
        return '';
    }

    const copy = svg.cloneNode(true) as SVGSVGElement;

    const rect = copy.children.item(1) as SVGRectElement;
    rect.removeAttribute('transform');

    const g = copy.children.item(2) as SVGGElement;
    g.removeAttribute('transform');

    const svgString = new XMLSerializer().serializeToString(copy);
    return svgString;
}