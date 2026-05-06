import React from 'react';
import { JsonSection } from '../../../components/JsonSection/JsonSection';
import { ImgPaths } from '../../../constants/img-paths';
import { Image } from '../../../types/basic.types';

const litterBackground: Image = {
	src: ImgPaths.pages.litter.app.background,
	alt: 'A doodled earth in space.',
};

function LitterApp() {
	return <JsonSection background={{ image: litterBackground }} items={[]} />;
}

export { LitterApp };
