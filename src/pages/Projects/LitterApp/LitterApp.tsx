import React from 'react';
import { JsonSection } from '../../../components/layout/JsonSection/JsonSection';
import { Image } from '../../../types/basic.types';

const litterBackground: Image = {
	src: '/img/app/background.png',
	alt: 'A doodled earth in space.',
};

function LitterApp() {
	return <JsonSection background={{ image: litterBackground }} items={[]} />;
}

export { LitterApp };
