export function forumlaToJavaFormula(formula: string): string {
    return formula.replace(/&/g, ' & ').replace(/\|/g, ' | ').replace(/!/g, '~')
}