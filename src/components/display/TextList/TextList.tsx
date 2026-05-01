import React from 'react';

interface TextListProps {
	strings: string[];
	separator?: React.ReactNode;
}

function TextList({
	strings,
	separator = <br />,
}: TextListProps): React.ReactNode {
	return strings.map((line, i) => (
		<React.Fragment key={i}>
			{line}
			{separator}
		</React.Fragment>
	));
}

export { TextList };
