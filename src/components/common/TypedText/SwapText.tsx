import * as React from 'react';
import { useMemo } from 'react';

/**
 * Get a random integer between a minimum and maximum value
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The random integer
 *
 * **/
function getRandomInt(min = 0, max = 100) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle the index of the list
 * @param indexList - The list of indices
 * @returns The shuffled index
 *
 * **/
function shuffleIndex(indexList: number[]): number {
	let newIndex = getRandomInt(0, indexList.length);
	while (indexList.includes(newIndex)) {
		newIndex = getRandomInt(0, indexList.length);
	}
	return newIndex;
}

/**
 * Shuffle the order of the list
 * @param listLength - The length of the list
 * @returns The shuffled list
 *
 * **/
function shuffleOrder(listLength: number): number[] {
	if (listLength === 0) return [];
	const order: number[] = [getRandomInt(0, listLength - 1)];
	while (order.length < listLength) {
		order.push(shuffleIndex(order));
	}
	return order;
}

/**
 * Swap the character at the given index from the current string to the new string
 * @param index - The index of the character to swap
 * @param currentString - The current string
 * @param newString - The new string
 * @returns The new string with the character swapped
 *
 * **/
function swapCharacterAt(
	index: number,
	currentString: string,
	newString: string,
): string | undefined {
	let newChar = newString.charAt(index);
	const currentChar = currentString.charAt(index);
	if (newChar == currentChar) return; //skip if same
	if (index > currentString.length + 1) newChar = ''; //new char is empty at that position

	const start = currentString.slice(0, index);
	const end =
		index > newString.length + 1 ? '' : currentString.slice(index + 1);
	return `${start}${newChar}${end}`;
}

/**
 * Swap the word at the given index from the current string to the new string
 * @param currentString - The current string
 * @param targetString - The target string
 * @param currentRef - The reference to the current string
 * @param onUpdate - The function to update the string
 * @param delay - The delay between the swaps
 * **/
function swapWordTo(
	currentString: string,
	targetString: string,
	currentRef: React.MutableRefObject<string>,
	onUpdate: (s: string) => void,
	delay = 100,
) {
	const maxLen = Math.max(currentString.length, targetString.length);
	const target = targetString.padEnd(maxLen, ' ');

	const diffIndices: number[] = []; // List of indices that are different between the current and target strings
	for (let i = 0; i < maxLen; i++) {
		// Only add the index to the list if the character is different
		if (currentString.padEnd(maxLen, ' ')[i] !== target[i]) diffIndices.push(i);
	}

	// Shuffle the order of the indices
	const order = shuffleOrder(diffIndices.length);

	// Swap the characters at the given indices
	order.forEach((orderIdx, step) => {
		const charIndex = diffIndices[orderIdx];
		setTimeout(() => {
			// Swap the character at the given index
			const next = swapCharacterAt(
				charIndex,
				currentRef.current.padEnd(maxLen, ' '),
				target,
			);

			// Update the current string if the character was swapped
			if (next !== undefined) {
				currentRef.current = next;
				onUpdate(next.trimEnd());
			}
		}, step * delay);
	});
}

/**
 * Swap the text at the given index from the current string to the new string
 * @param string_list - The list of strings
 * @param startDelay - The delay before the first swap
 * @param charDelay - The delay between the swaps
 * @param wordDelay - The delay between the words
 * **/
export interface SwapTextProps {
	string_list: string[];
	startDelay?: number;
	charDelay?: number;
	wordDelay?: number;
}

function SwapText({
	string_list = [],
	startDelay = 1000,
	charDelay = 250,
	wordDelay = 1750,
}: SwapTextProps) {
	const [currentString, setCurrentString] = React.useState(string_list[0]);
	const currentRef = React.useRef(string_list[0]);

	// Shuffle the order of the list
	const displayOrder = useMemo(
		() => shuffleOrder(string_list.length),
		[string_list],
	);

	React.useEffect(() => {
		let index = 0;
		let timer: ReturnType<typeof setTimeout>;

		// Advance the word to the next word in the list
		function advanceWord() {
			// Get the current and next words in the list
			const current = string_list[displayOrder[index]];
			const next = string_list[displayOrder[(index + 1) % string_list.length]];
			const maxLen = Math.max(current.length, next.length);

			// Set the current string to the current word
			currentRef.current = current;
			swapWordTo(
				current,
				next,
				currentRef,
				// need callback to update the current display string
				// as char swap occurs inside the swapWordTo function
				(s) => {
					currentRef.current = s;
					setCurrentString(s);
				},
				charDelay,
			);

			// Advance the index to the next word in the list
			index = (index + 1) % string_list.length;

			// Set the timer to the delay between the words
			timer = setTimeout(advanceWord, maxLen * charDelay + wordDelay);
		}

		// Set the timer to the start delay
		timer = setTimeout(advanceWord, startDelay);

		// Clear the timer when the component unmounts
		return () => clearTimeout(timer);
	}, [string_list, displayOrder, charDelay, startDelay, wordDelay]);

	return <span>{currentString}</span>;
}
export { SwapText };
