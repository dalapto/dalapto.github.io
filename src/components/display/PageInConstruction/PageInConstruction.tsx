import { Alert } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import { useBackground } from '../../../context/BackgroundContext';
import { Image } from '../../../types/basic.types';

const placeholderImg: Image = {
	src: '/img/bg/bigzoom.jpg',
	alt: 'Exaggerated zoom in of a stream.',
};

function PageInConstruction() {
	const { setBackground } = useBackground();

	useEffect(() => {
		setBackground({ image: placeholderImg, imagePosition: 'center 100%' });
		return () => setBackground(null, { freezeObservers: false });
	}, [setBackground]);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '90vh',
			}}
		>
			<Alert severity='info'>Not much to see here yet.. sorry!</Alert>
		</div>
	);
}
export { PageInConstruction };
