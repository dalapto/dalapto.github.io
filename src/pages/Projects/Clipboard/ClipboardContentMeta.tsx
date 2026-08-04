import React from 'react';
import { ExpiryTimer } from '../../../components/display/ExpiryTimer/ExpiryTimer';
import { CLIPBOARD_TTL_MS } from '../../../constants/clipboard-ttl';

interface ClipboardContentMetaProps {
	lastUpdated: Date;
	hasContent: boolean;
}

function ClipboardContentMeta({
	lastUpdated,
	hasContent,
}: ClipboardContentMetaProps) {
	const hasSavedContent = lastUpdated.getTime() !== 0;

	const lastUpdatedLabel = (
		<p>
			Last Updated:{' '}
			{hasSavedContent ? lastUpdated.toLocaleString() : 'a long time ago'}
		</p>
	);
	const expiresAt = new Date(lastUpdated.getTime() + CLIPBOARD_TTL_MS);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: '0.5rem',
			}}
		>
			{lastUpdatedLabel}
			{hasContent && <ExpiryTimer expiresAt={expiresAt} />}
		</div>
	);
}

export { ClipboardContentMeta };
