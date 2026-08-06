import { FormControl, FormHelperText } from '@mui/material';
import React, { useLayoutEffect, useRef } from 'react';
import './StandardTextArea.css';

interface StandardTextAreaProps {
	id?: string;
	name?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	/** Minimum height of the textarea. Defaults to '30em'. */
	minHeight?: string;
	style?: React.CSSProperties;
	className?: string;
	required?: boolean;
	error?: boolean;
	helperText?: string;
	onBlur?: () => void;
}

function resizeTextarea(textarea: HTMLTextAreaElement) {
	// Preserve scroll position — collapsing height to 0 to measure scrollHeight
	// can cause the browser to jump the viewport.
	const scrollY = window.scrollY;
	textarea.style.height = '0px';
	const minHeight = parseFloat(getComputedStyle(textarea).minHeight);
	textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight || 0)}px`;
	window.scrollTo(0, scrollY);
}

function StandardTextArea({
	required,
	id,
	name,
	value,
	onChange,
	placeholder,
	minHeight = '30em',
	style,
	className,
	error,
	helperText,
	onBlur,
}: StandardTextAreaProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const handleResize = () => resizeTextarea(textarea);
		handleResize();

		const observer = new IntersectionObserver((entries) => {
			if (entries[0]?.isIntersecting) handleResize();
		});
		observer.observe(textarea);

		return () => observer.disconnect();
	}, [value]);

	return (
		<FormControl fullWidth error={error}>
			<textarea
				ref={textareaRef}
				id={id}
				name={name}
				placeholder={placeholder}
				value={value}
				required={required}
				onBlur={onBlur}
				onChange={(e) => {
					onChange(e.target.value);
					resizeTextarea(e.target);
				}}
				style={{
					width: '100%',
					minWidth: '100%',
					minHeight,
					boxSizing: 'border-box',
					resize: 'none',
					overflow: 'hidden',
					display: 'block',
					...style,
				}}
				className={[
					'standard-textarea',
					error ? 'standard-textarea--error' : '',
					className,
				]
					.filter(Boolean)
					.join(' ')}
			/>
			{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
		</FormControl>
	);
}

export { StandardTextArea };
