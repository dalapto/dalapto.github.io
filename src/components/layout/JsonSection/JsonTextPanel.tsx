import React, { ReactNode } from 'react';
import { TextList } from '../../display/TextList/TextList';

interface JsonTextPanelData {
	content: string[];
	contentChildren?: ReactNode;
	contentBackground?: string;
	/** Max width of the panel. Defaults to unconstrained. */
	maxWidth?: string;
	/** Minimum height of the panel. */
	minHeight?: string;
	/** Padding around the panel. Defaults to '2rem 1rem'. */
	padding?: string;
}

function JsonTextPanel({
	content,
	contentChildren,
	contentBackground,
	maxWidth,
	minHeight,
	padding = '2rem 1rem',
}: JsonTextPanelData) {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight,
				padding,
			}}
		>
			<div
				style={{
					maxWidth,
					backgroundColor: contentBackground,
					padding: contentBackground ? '1rem' : undefined,
					borderRadius: contentBackground ? '0.5rem' : undefined,
					textAlign: 'center',
				}}
			>
				<TextList strings={content} />
				{contentChildren}
			</div>
		</div>
	);
}

export { JsonTextPanel };
export type { JsonTextPanelData };
