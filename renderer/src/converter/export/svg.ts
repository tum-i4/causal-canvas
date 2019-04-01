

export function svgExport(svg: SVGSVGElement | null): string {
    if (svg === null) {
        return '';
    }

    const { height, width } = (svg.children.item(2) as SVGGElement).getBoundingClientRect();
    const copy = svg.cloneNode(true) as SVGSVGElement;
    // copy.setAttribute('width', "" + width)
    // copy.setAttribute('height', "" + height)
    // copy.setAttribute('viewBox', "" + `${-width / 2} ${-height / 2} ${width} ${height}`)

    const rect = copy.children.item(1) as SVGRectElement;
    rect.removeAttribute('transform');

    const g = copy.children.item(2) as SVGGElement;
    g.removeAttribute('transform');

    const styles = Array.from(document.querySelectorAll('style'));
    return copy.outerHTML
        .replace('<svg', `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`)
        .replace('</svg>', styles.map(s => s.outerHTML).join('') + '</svg>');
}