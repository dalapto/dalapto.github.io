import { RefObject, useEffect, useRef } from 'react';

/**
 * Calls `onClickOutside` on a mousedown outside every element in `refs`,
 * while `isActive`. `refs` and the callback may be new on each render; the
 * listener always uses the latest without being re-attached.
 */
function useClickOutside(
	isActive: boolean,
	refs: RefObject<Element | null>[],
	onClickOutside: () => void,
) {
	const latest = useRef({ refs, onClickOutside });
	useEffect(() => {
		latest.current = { refs, onClickOutside };
	});

	useEffect(() => {
		if (!isActive) return;
		const handleClickOutside = (e: MouseEvent) => {
			const { refs: currentRefs, onClickOutside: callback } = latest.current;
			if (
				currentRefs.every(
					(ref) => ref.current && !ref.current.contains(e.target as Node),
				)
			) {
				callback();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isActive]);
}

export { useClickOutside };
