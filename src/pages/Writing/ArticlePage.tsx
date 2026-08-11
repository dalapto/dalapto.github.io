import React from 'react';
import { LoadingOverlay } from '../../components/display/LoadingOverlay/LoadingOverlay';
import { TextList } from '../../components/display/TextList/TextList';
import { JsonHeader } from '../../components/Json/JsonSection/JsonHeader';
import { JsonSection } from '../../components/Json/JsonSection/JsonSection';
import { colours } from '../../constants/colours';
import { busyTitle, useBusy } from '../../context/BusyContext';
import { usePointerGistContent } from '../../hooks/usePointerGistContent';

interface ArticlePageProps {
	pageKey: string;
}

function ArticleChapter({ title, lines }: { title: string; lines: string[] }) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
				width: '100%',
				textAlign: 'start',
			}}
		>
			<JsonHeader titleText={title} titleVariant='h3' />
			<div
				style={{
					backgroundColor: colours.primary,
					padding: '1rem',
					borderRadius: '0.5rem',
				}}
			>
				<TextList strings={lines} />
			</div>
		</div>
	);
}

function ArticlePage({ pageKey }: ArticlePageProps) {
	const { files, loading, error } = usePointerGistContent(pageKey);
	const { busy, label, variant, operation } = useBusy();

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

	const chapters = files.map((file) => (
		<ArticleChapter
			key={file.filename}
			title={file.filename.replace(/\.txt$/i, '')}
			lines={file.content.split('\n')}
		/>
	));

	return (
		<>
			<LoadingOverlay
				open={busy}
				title={busyTitle(operation, label, 'Loading…')}
				variant={variant}
			/>
			{!loading && (
				<>
					<div style={{ paddingTop: '8rem', paddingBottom: '3rem', textAlign: 'center' }}>
						<JsonHeader titleText={pageKey} />
					</div>
					<JsonSection
						items={chapters}
						gap='20rem'
						paddingBottom='12rem'
						maxWidth='55%'
					/>
				</>
			)}
		</>
	);
}

export { ArticlePage };
