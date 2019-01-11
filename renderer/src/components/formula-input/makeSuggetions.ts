
enum WordType {
    Variable,
    Operator
}

export function makeBetterSuggestionList() {
    const formulaWords = [];
    const currentWordIdx = 0;
    const currentWord = formulaWords[currentWordIdx];

    const previousWord = WordType.Operator;
    const nextWord = WordType.Variable;
}


function getWordIdx(cursorPos: number, formula: string): number {

    const splitFormula = formula.split(' ');

    let wordCount = 0;
    for (let i = 0; i < formula.length; i++) {
        const _char = formula.charAt(i);

        if (i === cursorPos) {
            return wordCount;
        }
        if (_char === ' ') {
            wordCount++;
        }
    }

    return -1;
};