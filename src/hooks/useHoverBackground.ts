import { useCallback } from 'react';
import {
	BackgroundConfig,
	SetBackgroundOptions,
	useBackground,
} from '../context/BackgroundContext';

interface UseHoverBackgroundOptions {
	/** Background to apply on hover. */
	config: BackgroundConfig;
	/** Options passed to setBackground when clearing on mouse-leave. */
	clearOptions?: SetBackgroundOptions;
}

/**
 * Returns onMouseEnter / onMouseLeave handlers that set and clear the global
 * background image while an element is hovered.
 */
function useHoverBackground({ config, clearOptions }: UseHoverBackgroundOptions) {
	const { setBackground } = useBackground();

	const onMouseEnter = useCallback(() => {
		setBackground(config);
	}, [config, setBackground]);

	const onMouseLeave = useCallback(() => {
		setBackground(null, clearOptions ?? { clearDelay: 100, freezeObservers: false });
	}, [clearOptions, setBackground]);

	return { onMouseEnter, onMouseLeave };
}

export { useHoverBackground };
