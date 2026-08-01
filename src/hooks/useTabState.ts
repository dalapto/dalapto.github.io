import { useCallback, useState } from 'react';
import type { JsonTab } from '../types/basic.types';

function useTabState(tabs: JsonTab[], initialTabId?: string) {
	const [currentTab, setCurrentTab] = useState(
		initialTabId ?? tabs[0]?.id ?? '',
	);

	const handleChange = useCallback(
		(_event: React.SyntheticEvent, newValue: string) => setCurrentTab(newValue),
		[],
	);

	return { currentTab, handleChange };
}

export { useTabState };
