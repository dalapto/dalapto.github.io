import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JsonHeader } from '../../components/Json/JsonSection/JsonHeader';
import { useBackground } from '../../context/BackgroundContext';
import {
	DEFAULT_WRITING_PAGE_BACKGROUND_BLUR,
	WRITING_HUB_ROUTE,
} from '../../utils/writing-articles';
import './ArticlePageHeader.css';

interface ArticlePageHeaderProps {
	title: string;
	backgroundImageUrl?: string;
	backgroundBlur?: number;
}

function ArticlePageHeader({
	title,
	backgroundImageUrl,
	backgroundBlur = DEFAULT_WRITING_PAGE_BACKGROUND_BLUR,
}: ArticlePageHeaderProps) {
	const { setBackground } = useBackground();

	useEffect(() => {
		if (!backgroundImageUrl) return;

		setBackground(
			{
				image: { src: backgroundImageUrl, alt: title },
				imagePosition: 'center center',
				blur: backgroundBlur,
			},
			{ freezeObservers: false },
		);

		return () => {
			setBackground(null, { freezeObservers: false });
		};
	}, [backgroundBlur, backgroundImageUrl, setBackground, title]);

	return (
		<div className='article-page-header'>
			<div className='article-page-header__nav'>
				<Link className='article-page-header__back' to={WRITING_HUB_ROUTE}>
					← Writing
				</Link>
			</div>
			<div className='article-page-header__title-panel'>
				<JsonHeader titleText={title} />
			</div>
		</div>
	);
}

export { ArticlePageHeader };
