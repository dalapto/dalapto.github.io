import React from 'react';
import { FormattedText } from '../FormattedText/FormattedText';

interface TextListProps {
	strings: string[];
	separator?: React.ReactNode;
	wrapper?: React.ElementType;
}



function TextList({
	strings,
	separator = <br />,
	wrapper: Wrapper = React.Fragment,
}: TextListProps): React.ReactNode {
	
	const textList = strings.map((line, i) => (
		<Wrapper key={i}>
			<FormattedText text={line}/>
			{separator}
		</Wrapper>
	));

	return textList;
}

export { TextList };
