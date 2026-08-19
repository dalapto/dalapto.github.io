import { ImgPaths } from '../constants/img-paths';
import type { PointerGistEntry } from '../services/github.service';

export const WRITING_ARTICLE_PARAM = 'article';
export const WRITING_HUB_ROUTE = '/writing';

/** Folder names with dedicated static routes — excluded from dynamic articles. */
export const STATIC_WRITING_FOLDER_KEYS = ['Analog', 'Bannjan'] as const;

/** Hub tile / page header images for static writing routes. */
export const staticWritingPageImages: Record<
	(typeof STATIC_WRITING_FOLDER_KEYS)[number],
	string
> = {
	Analog: ImgPaths.pages.writing.tile.analog,
	Bannjan: ImgPaths.pages.writing.tile.bannjan,
};

/** Route → image for Writing hub tiles (keys match nav route paths). */
export const staticWritingRouteImages: Record<string, string> = {
	'/analog': staticWritingPageImages.Analog,
	'/bannjan': staticWritingPageImages.Bannjan,
};

/** Default full-page background blur for writing articles (CSS px). */
export const DEFAULT_WRITING_PAGE_BACKGROUND_BLUR = 0.5;

/** Per-page background blur overrides — key is folder name (e.g. Bannjan). */
export const writingPageBackgroundBlur: Partial<
	Record<(typeof STATIC_WRITING_FOLDER_KEYS)[number], number>
> = {
	Bannjan: 0,
};

export function getWritingPageBackgroundBlur(pageKey: string): number {
	const normalized = pageKey.trim().toLowerCase();
	const match = STATIC_WRITING_FOLDER_KEYS.find(
		(key) => key.toLowerCase() === normalized,
	);
	if (match && writingPageBackgroundBlur[match] !== undefined) {
		return writingPageBackgroundBlur[match]!;
	}
	return DEFAULT_WRITING_PAGE_BACKGROUND_BLUR;
}

export function getStaticWritingPageImageUrl(
	folderKey: string,
): string | undefined {
	const normalized = folderKey.trim().toLowerCase();
	const match = STATIC_WRITING_FOLDER_KEYS.find(
		(key) => key.toLowerCase() === normalized,
	);
	return match ? staticWritingPageImages[match] : undefined;
}

export const reservedWritingFolderKeys = new Set<string>(
	STATIC_WRITING_FOLDER_KEYS,
);

export function writingArticleRoute(folderKey: string): string {
	return `${WRITING_HUB_ROUTE}?${WRITING_ARTICLE_PARAM}=${encodeURIComponent(folderKey)}`;
}

export function isStaticWritingFolderKey(folderKey: string): boolean {
	const normalized = folderKey.trim().toLowerCase();
	return STATIC_WRITING_FOLDER_KEYS.some(
		(key) => key.toLowerCase() === normalized,
	);
}

export function isPublicWritingFolder(
	folderKey: string,
	entry: PointerGistEntry | undefined,
	reservedFolderKeys: Set<string> = reservedWritingFolderKeys,
): boolean {
	if (reservedFolderKeys.has(folderKey)) return false;
	if (!entry || entry.hidden) return false;
	return true;
}
