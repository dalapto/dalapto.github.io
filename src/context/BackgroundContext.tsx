import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { Image } from '../types/basic.types';

interface BackgroundConfig {
	image: Image;
	imagePosition?: string;
	blur?: number;
	/** Fade transition duration in ms. Defaults to 400. */
	transitionDuration?: number;
}

interface SetBackgroundOptions {
	/** Delay in ms before clearing the background when passing null. Ignored for non-null configs. */
	clearDelay?: number;
}

interface BackgroundContextValue {
	background: BackgroundConfig | null;
	setBackground: (config: BackgroundConfig | null, opts?: SetBackgroundOptions) => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

function BackgroundProvider({ children }: { children: ReactNode }) {
	const [background, setBackgroundState] = useState<BackgroundConfig | null>(null);
	const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const setBackground = useCallback(
		(config: BackgroundConfig | null, opts?: SetBackgroundOptions) => {
			if (clearTimer.current) {
				clearTimeout(clearTimer.current);
				clearTimer.current = null;
			}
			if (config === null && opts?.clearDelay) {
				clearTimer.current = setTimeout(() => {
					setBackgroundState(null);
					clearTimer.current = null;
				}, opts.clearDelay);
			} else {
				setBackgroundState(config);
			}
		},
		[],
	);

	return (
		<BackgroundContext.Provider value={{ background, setBackground }}>
			{children}
		</BackgroundContext.Provider>
	);
}

function useBackground() {
	const ctx = useContext(BackgroundContext);
	if (!ctx) throw new Error('useBackground must be used within a BackgroundProvider');
	return ctx;
}

export { BackgroundProvider, useBackground };
export type { BackgroundConfig };
