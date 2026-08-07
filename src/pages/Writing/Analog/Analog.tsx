import { CircularProgress } from '@mui/material';
import React from 'react';
import type { JsonImageTextPanel } from '../../../components/Json/JsonSection/JsonPanel';
import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
import { colours } from '../../../constants/colours';
import { usePointerGistContent } from '../../../hooks/usePointerGistContent';

const PAGE_KEY = 'Analog';

function Analog() {
	const { files, loading, error } = usePointerGistContent(PAGE_KEY);

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8rem' }}>
				<CircularProgress />
			</div>
		);
	}

	if (error) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					paddingTop: '8rem',
					color: colours.error,
				}}
			>
				{error}
			</div>
		);
	}

	const headerPanel: JsonImageTextPanel = {
		kind: 'image-text',
		header: { titleText: PAGE_KEY },
		content: [],
	};

	const filePanels: JsonImageTextPanel[] = files.map((file) => ({
		kind: 'image-text',
		header: { titleText: file.filename.replace(/\.txt$/i, '') },
		content: file.content.split('\n'),
		contentBackground: colours.primary,
	}));

	return <JsonSection items={[headerPanel, ...filePanels]} gap='6rem' />;
}

export { Analog };
