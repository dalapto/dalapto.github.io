import React, { ReactNode } from 'react';
import { TooltipLink } from '../TooltipLink/TooltipLink';

const SEGMENT_REGEX = /<([@#`~_!?])([\s\S]+?)\1>/g;

const WRAPPERS: Record<string, keyof JSX.IntrinsicElements> = {
	'!': 'strong', '?': 'em', '_': 'u', '~': 's', '`': 'code',
};

function parseNodes(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	let lastIndex = 0;

	for (const match of text.matchAll(SEGMENT_REGEX)) {
		if (match.index! > lastIndex)
			nodes.push(text.slice(lastIndex, match.index));

		const [, sigil, inner] = match;

		if (sigil === '@' || sigil === '#') {
			const [label, href, img] = inner.split(sigil);
			nodes.push(img
				? <TooltipLink key={match.index} text={label} href={href} imgSrc={img} placement='top' offset={[0, -13]} />
				: <a key={match.index} href={href} target='_blank' rel='noopener noreferrer'>{label}</a>
			);
		} else {
			const Tag = WRAPPERS[sigil];
			nodes.push(<Tag key={match.index}>{parseNodes(inner)}</Tag>);
		}

		lastIndex = match.index! + match[0].length;
	}

	if (lastIndex < text.length)
		nodes.push(text.slice(lastIndex));

	return nodes;
}

function FormattedText({ text }: { text: string }) {
	return <>{parseNodes(text)}</>;
}

export { FormattedText };
