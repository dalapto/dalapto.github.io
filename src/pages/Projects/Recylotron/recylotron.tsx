import React from 'react';
import projectsPanel from '../../../components/content/projectsPanel';
import type { JsonImageTextPanel } from '../../../components/JsonSection/JsonPanel';
import { JsonSection } from '../../../components/JsonSection/JsonSection';
import { colors } from '../../../constants/colors';
import { ImgPaths } from '../../../constants/img-paths';
import {
	formatLink,
	knnLink,
	mApLink,
	machineLearningLink,
	raspberryPiLink,
	recyclingPollsLink,
	recyclotronDocsLink,
	recyclotronProjectPlanLink,
	recyclotronUserGuideLink,
	resNetLink,
	soundsnapLink,
} from '../../../constants/link-constants';
import {
	glassImages,
	hwImages,
	knnImages,
	metricsImages,
	planImages,
	resnetImages,
	useImages,
} from './recylotron-constants';

const raspberryPi = formatLink(raspberryPiLink);
const knn = formatLink(knnLink);
const resNet = formatLink(resNetLink);
const mAp = formatLink(mApLink);
const machineLearning = formatLink(machineLearningLink);
const recyclingPolls = formatLink(recyclingPollsLink);
const docs = formatLink(recyclotronDocsLink);
const projectPlan = formatLink(recyclotronProjectPlanLink);
const userGuide = formatLink(recyclotronUserGuideLink);
const soundsnap = formatLink(soundsnapLink);

const headerPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: 'Recyclotron',
		subtitleText: 'Auto-Sorting Recycling Bin',
	},

	content: [
		'For our Robot group project we made an auto-sorting recycling bin, called Recyclotron.',
		'',
		'Only about 50% of the population chooses to recycle every day, as they find it inconvenient and time-consuming.',
		`${recyclingPolls}`,
		'',
	],
	headerBackground: colors.background,
	contentBackground: colors.primary,
};

const briefPanel: JsonImageTextPanel = {
	kind: 'image-text',
	content: [
		"Users don't need to choose now - throw it into Recylotron and it recycles for you.",
		'The instant rubbish lands in the bin, Recyclotron categorises and sorts it.',
		'',
		'Businesses could give it whatever categories they want and even train it using their own rubbish.',
		'',
		`You can view the full project plan ${projectPlan}.`,
	],
	imageSlot: planImages,
	contentBackground: colors.primary,
	maxWidth: '65%',
};

const howItWorksPanel: JsonImageTextPanel = {
	kind: 'image-text',
	content: [
		'Our prototype worked like a train that lives on top of multiple bins.',
		"Drop rubbish into a box, it's analysed, then the box then moves over and drops rubbish into the correct bin.",
		'',
		'Despite COVID lockdowns, we finished a working prototype.',
		'',
		`The code is lost to time, but you can view documentation in this ${docs}.`,
	],
	imageSlot: useImages,
	stackImage: true,
	contentBackground: colors.primary,
	maxWidth: '50%',
};

const hardwarePanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: 'Hardware',
	},
	content: [
		'',
		'Our first prototype box users drop rubbish into was made out of lego.',
		'That ran on two rails along the bins, using Arduino motors to move back and forth.',
		'',
		'Inside the box 2 simple webcams and an IR sensor collect data to analyse the rubbish.',
		'Once users close the lid, electromagnets lock it while sorting takes place.',
		`All these sensor values are fed into a ${raspberryPi}, which connects to a computer server.`,
		'This server then analyses and suggests most likely category for the rubbish.',
		'',
		'Ultrasound sensors detect which bin the box is over, so it can work out if it needs to move.',
		'Once over the correct bin, a trapdoor opens to drop the rubbish in.',
		'',
		`You can view more details in the full user guide ${userGuide}.`,
		'',
	],
	imageSlot: hwImages,
	contentBackground: colors.primary,
};

const classificationPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: 'Software',
	},
	content: [
		'',
		'How do you know what material rubbish is?',
		'',
		'Most of the time, we just use our eyes, as most things are packaged similarly.',
		'',
		'In the same way, we gave Recyclotron a camera to see what rubbish a user gave it.',
		`${machineLearning} would then predict what category that object is.`,
		'',
		`We started with a simple ${knn} model in Python.`,
		'KNN essentially finds the closest match to existing data, meaning it compared with all other photos.',
		'We split an image library of labelled food objects in half, one to train the KNN model and the other to test it.',
		'That only gave us 55% accuracy.',
		'',
	],
	imageSlot: knnImages,
	contentBackground: colors.primary,
};

const classificationPanel2: JsonImageTextPanel = {
	kind: 'image-text',
	reverseColumns: true,
	imageSlot: glassImages,
	content: [
		'',
		'Plastic packaging is incredibly varied, and was constantly mistaken for glass or paper.',
		'Another camera angle, recorded audio and IR luminosity boosted performance a lot.',
		'',
		'If you close your eyes, hold the rubbish in your hand and clench your fist, what does it sound like?',
		'Crisp packets or chocolate wrappers make a special scrunch, glass bottles clunk and metal cans clang.',
		`We also used audio from ${soundsnap} to train and test Recylotron to use that data too.`,
		'',
	],
	contentBackground: colors.primary,
};

const classificationPanel3: JsonImageTextPanel = {
	kind: 'image-text',
	imageMinWidth: '40%',
	content: [
		'',
		`KNN is inefficient and weak generalist, so we switched to ${resNet}.`,
		'We trained that on a dataset of 1.5 million images, specifically images of rubbish.',
		'We then tested it on our own rubbish to measure performance, improving accuracy to 80%.',
		'',
	],
	imageSlot: resnetImages,
	contentBackground: colors.primary,
};

const classificationPanel4: JsonImageTextPanel = {
	kind: 'image-text',
	reverseColumns: true,
	content: [
		'',
		'Real-world metrics for recycling care about contamination and total amount recycled.',
		"It's a tradeoff between precision (is everything in correct category?) and recall (is everything recycled?).",
		`${mAp} gave us a general metric across all categories, and is commonly used to measure ML performance.`,
		'',
		"Reyclotron's performance was only 5% behind 3 of the UK's biggest recycling centres.",
		'',
	],
	imageSlot: metricsImages,
	contentBackground: colors.primary,
};

function Recyclotron() {
	return (
		<JsonSection
			gap='8rem'
			background={{
				image: {
					src: ImgPaths.pages.recylotron.other.feedback,
					alt: 'LitterApp background image.',
				},
				imagePosition: 'center 100%',
				imageFit: 'cover',
			}}
			items={[
				headerPanel,
				{
					kind: 'group',
					panels: [briefPanel, howItWorksPanel],
				},
				{
					kind: 'group',
					panels: [
						hardwarePanel,
						classificationPanel,
						classificationPanel2,
						classificationPanel3,
						classificationPanel4,
					],
				},
				projectsPanel,
			]}
		/>
	);
}

export { Recyclotron };
