import './MediaPlayer.css';

interface VideoPlayerProps {
	src: string;
	/** Used as the element's accessible title. */
	title?: string;
	className?: string;
}

/** The browser's native video player with controls. */
function VideoPlayer({ src, title, className }: VideoPlayerProps) {
	return (
		<video
			className={['video-player', className].filter(Boolean).join(' ')}
			src={src}
			title={title}
			controls
			playsInline
			preload='metadata'
		>
			Your browser can&apos;t play this video.
		</video>
	);
}

export { VideoPlayer };
