import { useEffect, RefObject } from 'react';

function useClickOutside(
	isActive: boolean,
	refs: RefObject<Element | null>[],
	onClickOutside: () => void,
) {
	useEffect(() => {
		if (!isActive) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (refs.every((ref) => ref.current && !ref.current.contains(e.target as Node))) {
				onClickOutside();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isActive, ...refs, onClickOutside]); // eslint-disable-line react-hooks/exhaustive-deps
}

export { useClickOutside };
