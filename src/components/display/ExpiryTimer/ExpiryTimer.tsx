import React, { useEffect, useState } from 'react';

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const parts: string[] = [];
	if (hours > 0) parts.push(`${hours}h`);
	if (hours > 0 || minutes > 0) parts.push(`${minutes}m`);
	parts.push(`${seconds}s`);
	return parts.join(' ');
}

interface ExpiryTimerProps {
	expiresAt: Date;
}

function ExpiryTimer({ expiresAt }: ExpiryTimerProps) {
	const [, tick] = useState(0);

	useEffect(() => {
		const id = setInterval(() => tick((n) => n + 1), 1000);
		return () => clearInterval(id);
	}, [expiresAt]);

	const remainingMs = expiresAt.getTime() - Date.now();
	const duration = formatDuration(Math.abs(remainingMs));

	return (
		<p>
			{remainingMs <= 0
				? `Expired ${duration} ago`
				: `Expires in ${duration}`}
		</p>
	);
}

export { ExpiryTimer };
