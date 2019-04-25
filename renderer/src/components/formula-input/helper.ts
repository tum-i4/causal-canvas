import { INode } from "../../types/GraphTypes";
import { getWordType, WordType } from "./makeSuggetions";


export const makeTitleFormula = (formula: string, nodes: INode[]) => {
	const splitFormula = formula.replace(/&/g, ' & ').replace(/\|/g, ' | ').split(' ');
	let newFormula = ""
	for (const word of splitFormula) {
		if (getWordType(word) === WordType.Variable) {
			const node = nodes.find(n => n.id === word.replace('!', ''));
			if (node === undefined) {
				newFormula += word;
			} else {
				if (word.startsWith('!')) {
					newFormula += '!' + node.title;
				} else {
					newFormula += node.title;
				}
			}
		} else {
			newFormula += word;
		}
	}

	return newFormula;
}