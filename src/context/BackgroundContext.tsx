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

interface ScrollObserverOptions {
	rootMargin?: string;
	threshold?: number[];
	/** Higher priority wins over lower when multiple elements are intersecting. Defaults to 0. */
	priority?: number;
}

interface BackgroundContextValue {
	background: BackgroundConfig | null;
	setBackground: (config: BackgroundConfig | null, opts?: SetBackgroundOptions) => void;
	registerScrollElement: (el: Element, config: BackgroundConfig, opts?: ScrollObserverOptions) => void;
	unregisterScrollElement: (el: Element) => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

function observerKey(opts: ScrollObserverOptions): string {
	const margin = opts.rootMargin ?? '-35% 0px -35% 0px';
	const thresholds = (opts.threshold ?? [0, 0.25, 0.5, 0.75, 1]).join(',');
	return `${margin}|${thresholds}`;
}

function BackgroundProvider({ children }: { children: ReactNode }) {
	const [background, setBackgroundState] = useState<BackgroundConfig | null>(null);
	const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Map from element → its background config
	const elementConfigMap = useRef<Map<Element, BackgroundConfig>>(new Map());
	// Map from element → current intersectionRatio
	const intersectingMap = useRef<Map<Element, number>>(new Map());
	// Map from element → its priority
	const elementPriorityMap = useRef<Map<Element, number>>(new Map());
	// Map from observer key → IntersectionObserver instance
	const observersMap = useRef<Map<string, IntersectionObserver>>(new Map());
	// Map from element → observer key (so we know which observer to unobserve from)
	const elementObserverKeyMap = useRef<Map<Element, string>>(new Map());

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

	const pickWinner = useCallback(() => {
		if (intersectingMap.current.size === 0) {
			setBackground(null, { clearDelay: 150 });
			return;
		}
		const [winnerEl] = [...intersectingMap.current.entries()].sort(([elA, ratioA], [elB, ratioB]) => {
			const priA = elementPriorityMap.current.get(elA) ?? 0;
			const priB = elementPriorityMap.current.get(elB) ?? 0;
			if (priB !== priA) return priB - priA;
			return ratioB - ratioA;
		})[0];
		const config = elementConfigMap.current.get(winnerEl);
		if (config) setBackground(config);
	}, [setBackground]);

	const getOrCreateObserver = useCallback(
		(opts: ScrollObserverOptions): IntersectionObserver => {
			const key = observerKey(opts);
			if (!observersMap.current.has(key)) {
				const observer = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								intersectingMap.current.set(entry.target, entry.intersectionRatio);
							} else {
								intersectingMap.current.delete(entry.target);
							}
						});
						pickWinner();
					},
					{
						rootMargin: opts.rootMargin ?? '-35% 0px -35% 0px',
						threshold: opts.threshold ?? [0, 0.25, 0.5, 0.75, 1],
					},
				);
				observersMap.current.set(key, observer);
			}
			return observersMap.current.get(key)!;
		},
		[pickWinner],
	);

	const registerScrollElement = useCallback(
		(el: Element, config: BackgroundConfig, opts: ScrollObserverOptions = {}) => {
			elementConfigMap.current.set(el, config);
			elementPriorityMap.current.set(el, opts.priority ?? 0);
			const key = observerKey(opts);
			elementObserverKeyMap.current.set(el, key);
			const observer = getOrCreateObserver(opts);
			observer.observe(el);
		},
		[getOrCreateObserver],
	);

	const unregisterScrollElement = useCallback((el: Element) => {
		elementConfigMap.current.delete(el);
		intersectingMap.current.delete(el);
		elementPriorityMap.current.delete(el);
		const key = elementObserverKeyMap.current.get(el);
		if (key) {
			observersMap.current.get(key)?.unobserve(el);
			elementObserverKeyMap.current.delete(el);
		}
	}, []);

	return (
		<BackgroundContext.Provider value={{ background, setBackground, registerScrollElement, unregisterScrollElement }}>
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
export type { BackgroundConfig, ScrollObserverOptions, SetBackgroundOptions };
