import { filterArticleTextFilenames } from './article-page-image';

export interface PointerGistArticle {
	name: string;
	order: number;
}

export interface PointerGistEntryArticles {
	articles: PointerGistArticle[];
}

type LegacyPointerGistEntry = {
	files?: string[];
	articles?: PointerGistArticle[];
};

export const MAX_ARTICLE_ORDER = 999;

export function clampOrderInput(value: string): string {
	return value.replace(/\D/g, '').slice(0, 3);
}

export function parseOrderInput(value: string): number | undefined {
	const trimmed = value.trim();
	if (!trimmed) return undefined;
	const parsed = Number(trimmed);
	if (!Number.isInteger(parsed) || parsed < 0 || parsed > MAX_ARTICLE_ORDER) {
		return undefined;
	}
	return parsed;
}

export function formatOrderInput(order: number | undefined): string {
	return order === undefined ? '' : String(order);
}

export function findArticleByFilename(
	articles: PointerGistArticle[],
	filename: string,
): PointerGistArticle | undefined {
	const target = filename.trim().toLowerCase();
	return articles.find((item) => item.name.trim().toLowerCase() === target);
}

export function sortArticlesByOrder(
	articles: PointerGistArticle[],
): PointerGistArticle[] {
	return [...articles].sort(
		(a, b) => a.order - b.order || a.name.localeCompare(b.name),
	);
}

export function migrateLegacyArticles(
	entry: LegacyPointerGistEntry,
): PointerGistArticle[] {
	if (entry.articles?.length) {
		return entry.articles.map((item) => ({
			name: item.name.trim(),
			order: item.order,
		}));
	}

	return (entry.files ?? []).map((name, index) => ({
		name: name.trim(),
		order: (index + 1) * 10,
	}));
}

export function mergeArticlesWithGistFilenames(
	existingArticles: PointerGistArticle[],
	gistFilenames: string[],
	image: string | undefined,
	orderUpdates: PointerGistArticle[] = [],
): PointerGistArticle[] {
	const textFilenames = filterArticleTextFilenames(gistFilenames, image);
	const orderByName = new Map<string, number>();

	for (const article of existingArticles) {
		orderByName.set(article.name.trim().toLowerCase(), article.order);
	}
	for (const update of orderUpdates) {
		orderByName.set(update.name.trim().toLowerCase(), update.order);
	}

	let nextDefaultOrder =
		orderByName.size > 0 ? Math.max(...orderByName.values()) + 10 : 10;

	return textFilenames.map((name) => {
		const key = name.trim().toLowerCase();
		const existingOrder = orderByName.get(key);
		if (existingOrder !== undefined) {
			return { name, order: existingOrder };
		}
		const assigned = nextDefaultOrder;
		nextDefaultOrder += 10;
		return { name, order: assigned };
	});
}

export function renameArticleInList(
	articles: PointerGistArticle[],
	oldFilename: string,
	newFilename: string,
): PointerGistArticle[] {
	const oldKey = oldFilename.trim().toLowerCase();
	return articles.map((article) => {
		if (article.name.trim().toLowerCase() !== oldKey) return article;
		return { ...article, name: newFilename };
	});
}
