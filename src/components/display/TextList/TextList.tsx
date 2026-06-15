import React from 'react';
import { FormattedText } from '../FormattedText/FormattedText';

interface TextListProps {
	strings: string[];
	separator?: React.ReactNode;
	wrapper?: React.ElementType;
}

// Line-level list sigil: `<*> item` → unordered, `<1> item` → ordered.
// The marker is consumed here; only the item text runs through FormattedText.
const LIST_REGEX = /^<([*1])>\s+([\s\S]*)$/;

function TextList({
	strings,
	separator = <br />,
	wrapper: Wrapper = React.Fragment,
}: TextListProps): React.ReactNode {
	const nodes: React.ReactNode[] = [];
	let i = 0;

	while (i < strings.length) {
		const match = strings[i].match(LIST_REGEX);

		if (match) {
			const ordered = match[1] === '1';
			const items: string[] = [];

			while (i < strings.length) {
				const itemMatch = strings[i].match(LIST_REGEX);
				if (!itemMatch || (itemMatch[1] === '1') !== ordered) break;
				items.push(itemMatch[2]);
				i++;
			}

			const List = ordered ? 'ol' : 'ul';
			nodes.push(
				<List key={i} style={{ textAlign: 'start', width: 'fit-content', margin: '0 auto' }}>
					{items.map((item, k) => (
						<li key={k}>
							<FormattedText text={item} />
						</li>
					))}
				</List>
			);
			continue;
		}

		nodes.push(
			<Wrapper key={i}>
				<FormattedText text={strings[i]} />
				{separator}
			</Wrapper>
		);
		i++;
	}

	return nodes;
}

export { TextList };
