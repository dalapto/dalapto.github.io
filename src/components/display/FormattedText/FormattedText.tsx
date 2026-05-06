import React, { ReactNode } from 'react';
import { SmartLink } from '../SmartLink/SmartLink';
import { TooltipLink } from '../TooltipLink/TooltipLink';

const SEGMENT_REGEX = /<([@#])([\s\S]+?)>|<([`~_!?])([\s\S]+?)\3>/g;

const WRAPPERS: Record<string, keyof JSX.IntrinsicElements> = {
	'!': 'strong', '?': 'em', '_': 'u', '~': 's', '`': 'code',
};

function parseNodes(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	let lastIndex = 0;

	for (const match of text.matchAll(SEGMENT_REGEX)) {
		if (match.index! > lastIndex)
			nodes.push(text.slice(lastIndex, match.index));

		const sigil = match[1] ?? match[3];
		const inner = match[2] ?? match[4];

		if (sigil === '@' || sigil === '#') {
			const [label, href, img] = inner.split(sigil);
			nodes.push(img
				? <TooltipLink key={match.index} text={label} href={href} imgSrc={img} placement='top' offset={[0, -13]} />
				: <SmartLink key={match.index} href={href}>{label}</SmartLink>
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
