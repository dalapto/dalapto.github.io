import './MediaPlayer.css';

interface AudioPlayerProps {
	src: string;
	/** Used as the element's accessible title. */
	title?: string;
	className?: string;
}

/** The browser's native audio player with controls. */
function AudioPlayer({ src, title, className }: AudioPlayerProps) {
	return (
		<audio
			className={['audio-player', className].filter(Boolean).join(' ')}
			src={src}
			title={title}
			controls
			preload='metadata'
		>
			Your browser can&apos;t play this audio.
		</audio>
	);
}

export { AudioPlayer };
