import { Box } from '@mui/material';
import React from 'react';
import { ExpiryTimer } from '../../../components/display/ExpiryTimer/ExpiryTimer';
import { CLIPBOARD_TTL_MS } from '../../../constants/clipboard-ttl';

interface ClipboardMetaProps {
	lastUpdated: Date;
	hasContent: boolean;
	hasNoChanges: boolean;
}

const metaTextSx = {
	m: 0,
	fontSize: '0.8125rem',
	opacity: 0.6,
} as const;

function ClipboardLastUpdated({ lastUpdated }: { lastUpdated: Date }) {
	const hasSavedContent = lastUpdated.getTime() !== 0;
	const lastUpdatedText = hasSavedContent
		? lastUpdated.toLocaleString()
		: 'a long time ago';

	return (
		<Box component='p' sx={metaTextSx}>
			Last updated: {lastUpdatedText}
		</Box>
	);
}

function ClipboardExpiry({
	lastUpdated,
	hasContent,
	hasNoChanges,
}: ClipboardMetaProps) {
	const hasSavedContent = lastUpdated.getTime() !== 0;
	const showExpiry = hasSavedContent && hasContent && hasNoChanges;

	if (!showExpiry) return null;

	const expiresAt = new Date(lastUpdated.getTime() + CLIPBOARD_TTL_MS);

	return (
		<Box sx={{ ...metaTextSx, '& p': { m: 0 } }}>
			<ExpiryTimer expiresAt={expiresAt} />
		</Box>
	);
}

function ClipboardContentMeta({
	lastUpdated,
	hasContent,
	hasNoChanges,
}: ClipboardMetaProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				gap: { xs: 0.5, sm: 1 },
				flex: 1,
				minWidth: 0,
			}}
		>
			<ClipboardLastUpdated lastUpdated={lastUpdated} />
			<ClipboardExpiry
				lastUpdated={lastUpdated}
				hasContent={hasContent}
				hasNoChanges={hasNoChanges}
			/>
		</Box>
	);
}

export { ClipboardContentMeta, ClipboardExpiry, ClipboardLastUpdated };
