import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HubPage } from '../../components/layout/HubPage/HubPage';
import { useWritingPages } from '../../context/WritingPagesContext';
import { navRoutes } from '../../routes';
import {
	isPublicWritingFolder,
	isStaticWritingFolderKey,
	staticWritingRouteImages,
	writingArticleRoute,
	WRITING_ARTICLE_PARAM,
} from '../../utils/writing-articles';
import { ArticlePage } from './ArticlePage';

const translations = {
	writing_blurb: [
		'Want to read something I wrote?',
		'Pick something to read below.',
	],
};

const tileBgPositions: Record<string, string> = {
	'/analog': 'center center',
	'/bannjan': 'center center',
};

function Writing() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { entries, publicArticles, loading, getArticleImageUrl } =
		useWritingPages();
	const article = searchParams.get(WRITING_ARTICLE_PARAM);

	const tileImages = useMemo(() => {
		const map: Record<string, string> = { ...staticWritingRouteImages };
		for (const [folderKey, entry] of Object.entries(entries)) {
			if (isStaticWritingFolderKey(folderKey)) continue;
			if (!isPublicWritingFolder(folderKey, entry)) continue;
			const imageUrl = getArticleImageUrl(folderKey);
			if (imageUrl) {
				map[writingArticleRoute(folderKey)] = imageUrl;
			}
		}
		return map;
	}, [entries, getArticleImageUrl]);

	useEffect(() => {
		if (loading || !article) return;

		const entry = entries[article];
		if (!isPublicWritingFolder(article, entry)) {
			navigate('/writing', { replace: true });
		}
	}, [article, entries, loading, navigate]);

	if (loading) return null;

	if (article) {
		const entry = entries[article];
		if (!isPublicWritingFolder(article, entry)) {
			return null;
		}

		return <ArticlePage pageKey={article} />;
	}

	const staticPages =
		navRoutes
			.find((route) => route.route === '/writing')
			?.children?.filter((route) => route.label && !route.hide) ?? [];

	return (
		<HubPage
			title='Writing'
			ariaLabel='Writing'
			blurb={translations.writing_blurb}
			pages={[...staticPages, ...publicArticles]}
			tileImages={tileImages}
			tileBgPositions={tileBgPositions}
		/>
	);
}

export { Writing };
