import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Image } from '../types/basic.types';

interface BackgroundConfig {
	image: Image;
	imagePosition?: string;
	blur?: number;
}

interface BackgroundContextValue {
	background: BackgroundConfig | null;
	setBackground: (config: BackgroundConfig | null) => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

function BackgroundProvider({ children }: { children: ReactNode }) {
	const [background, setBackground] = useState<BackgroundConfig | null>(null);

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
