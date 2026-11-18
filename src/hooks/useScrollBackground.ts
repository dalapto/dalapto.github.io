import { useEffect, useRef } from 'react';
import { BackgroundConfig, ScrollObserverOptions, useBackground } from '../context/BackgroundContext';

interface UseScrollBackgroundOptions {
	/** Background to apply when the element scrolls into the trigger zone. */
	config: BackgroundConfig;
	/** IntersectionObserver options controlling the trigger zone. */
	observer?: ScrollObserverOptions;
}

/**
 * Returns a ref to attach to any element. When that element enters the scroll
 * trigger zone it sets the global background; when all registered elements
 * leave the zone the background clears.
 *
 * Multiple instances across the page share a single IntersectionObserver per
 * unique observer config, and winner selection (highest intersectionRatio) is
 * handled centrally in BackgroundContext.
 */
function useScrollBackground<T extends Element = Element>({
	config,
	observer: observerOpts,
}: UseScrollBackgroundOptions) {
	const ref = useRef<T>(null);
	const { registerScrollElement, unregisterScrollElement } = useBackground();

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		registerScrollElement(el, config, observerOpts);
		return () => unregisterScrollElement(el);
	// Intentionally mount-only: `config` and `observerOpts` are read once when the
	// element registers. Callers pass inline objects (new every render), so listing
	// them would unregister/re-register the element on every render. Consequence:
	// changing the config after mount has no effect — remount (e.g. via `key`) to
	// apply a new one. (Review R1-F28: left as-is by choice.)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return ref;
}

export { useScrollBackground };
export type { UseScrollBackgroundOptions };
