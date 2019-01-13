
enum WordType {
    Variable,
    Operator,
    Nothing
}

export function makeSuggestionList(cursorPos: number, formula: string, _baseSuggestions: string[]): string[] {
    const formulaWords = formula.split(' ');
    const currentWordIdx = getWordIdx(cursorPos, formula);
    const currentWord = formulaWords[currentWordIdx];

    const wordType = getWordType(currentWord);
    const previousWordType = getWordType(formulaWords[currentWordIdx - 1]);
    const nextWordType = getWordType(formulaWords[currentWordIdx + 1]);

    let baseSuggestions = _baseSuggestions;
    console.log({
        cursorPos,
        currentWordIdx,
        currentWord,
        wordType,
        previousWord: previousWordType,
        nextWord: nextWordType
    })

    if (wordType === WordType.Operator) {
        return [];
    }

    if (previousWordType === WordType.Variable && currentWord === '') {
        return ['&', '|']
    }

    if (currentWord.startsWith('!')) {
        baseSuggestions = baseSuggestions.map(s => `!${s}`)
    }

    return baseSuggestions
        .filter(suggestion => suggestion.startsWith(currentWord))
}

const isOperator = (word: string) => /&|\|/.test(word);
const getWordType = (word: string) => word === undefined ? WordType.Nothing : isOperator(word) ? WordType.Operator : WordType.Variable;

function getWordIdx(cursorPos: number, formula: string): number {

    if (cursorPos === formula.length) {
        return formula.split(' ').length - 1;
    }

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