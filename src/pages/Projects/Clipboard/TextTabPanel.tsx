import React, { useLayoutEffect, useRef } from 'react';
import { ActionsPanel } from '../../../components/layout/ActionsPanel/ActionsPanel';
import { ClipboardTabActions } from './ClipboardButtons';
import { ClipboardContentMeta } from './ClipboardContentMeta';

interface TextTabPanelProps {
	textContent: string;
	onTextChange: (value: string) => void;
	lastUpdatedText: Date;
	hasContent: boolean;
	hasNoTextChanges: boolean;
	onClear: () => void;
	onSave: () => void;
	onRefresh: () => void;
}

function resizeTextarea(textarea: HTMLTextAreaElement) {
	textarea.style.height = '0px';
	const minHeight = parseFloat(getComputedStyle(textarea).minHeight);
	textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight || 0)}px`;
}

function TextTabPanel({
	textContent,
	onTextChange,
	lastUpdatedText,
	hasContent,
	hasNoTextChanges,
	onClear,
	onSave,
	onRefresh,
}: TextTabPanelProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const handleResize = () => resizeTextarea(textarea);

		handleResize();

		const observer = new IntersectionObserver((entries) => {
			if (entries[0]?.isIntersecting) {
				handleResize();
			}
		});
		observer.observe(textarea);

		return () => observer.disconnect();
	}, [textContent]);

	return (
		<ActionsPanel
			onRefresh={onRefresh}
			actions={
				<ClipboardTabActions
					hasContent={hasContent}
					hasNoChanges={hasNoTextChanges}
					onClear={onClear}
					onSave={onSave}
				/>
			}
		>
			<textarea
				ref={textareaRef}
				id='textpaste'
				name='textpaste'
				placeholder=' Paste text in here...'
				value={textContent}
				onChange={(e) => {
					onTextChange(e.target.value);
					resizeTextarea(e.target);
				}}
				style={{
					width: '100%',
					minWidth: '100%',
					minHeight: '30em',
					boxSizing: 'border-box',
					resize: 'none',
					overflow: 'hidden',
					display: 'block',
				}}
			/>
			<ClipboardContentMeta
				lastUpdated={lastUpdatedText}
				hasContent={hasContent}
			/>
		</ActionsPanel>
	);
}

export { TextTabPanel };
