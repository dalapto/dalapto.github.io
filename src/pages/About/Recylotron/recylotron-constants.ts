import type { JsonSectionImageSlot } from '../../../components/Json/JsonSection/JsonPanel';
import { ImgPaths } from '../../../constants/img-paths';

const r = ImgPaths.pages.recylotron;

const planImages: JsonSectionImageSlot = {
	images: [
		{
			src: r.plan.gant,
			alt: 'Gantt chart showing the project timeline.',
			caption: 'A timeline of the project through a Gantt chart.',
		},
		{
			src: r.plan.rails,
			alt: 'Concept diagram of the rail system.',
			caption: 'A concept diagram of the rail system.',
		},
		{
			src: r.plan.trapdoor,
			alt: 'Concept diagram of the trapdoor mechanism.',
			caption: 'A concept diagram of the trapdoor mechanism.',
		},
	],
	cyclerInterval: 8000,
};

const useImages: JsonSectionImageSlot = {
	images: [
		{
			src: r.use.step1,
			alt: 'Diagram showing how Recyclotron operates.',
			caption: 'Diagram showing how Recyclotron operates.',
		},
		{
			src: r.use.flow,
			alt: 'Flow diagram of how Recyclotron is used.',
			caption: 'A flow diagram of how Recyclotron is used.',
		},
	],
	cyclerInterval: 8000,
};

const hwImages: JsonSectionImageSlot = {
	images: [
		{
			src: r.hw.front,
			alt: 'Labelled diagram of the chamber from the front.',
			caption: 'Labelled diagram of the chamber from the front.',
		},
		{
			src: r.hw.back,
			alt: 'Labelled diagram of the chamber from the back.',
			caption: 'Labelled diagram of the chamber from the back.',
		},
		{
			src: r.hw.lego1,
			alt: 'Photo of the Lego Recyclotron body.',
			caption: 'The lego prototype.',
		},
		{
			src: r.hw.lego2,
			alt: 'Photo of the Lego Recyclotron body (angle 2).',
			caption: 'The lego prototype body (angle 2).',
		},
	],
	cyclerInterval: 6000,
};

const glassImages: JsonSectionImageSlot = {
	images: [
		{
			src: r.graphs.cmatrix,
			alt: 'Confusion matrix for the KNN model.',
			caption:
				'KNN confusion matrix showing how well the model predicted each category.',
		},
		{
			src: r.graphs.purity,
			alt: 'Graph showing purity of Recyclotron compared to French Recycling Centre standards.',
			caption:
				'Graph showing purity of Recyclotron compared to French Recycling Centre standards.',
		},
	],
};

const knnImages: JsonSectionImageSlot = {
	images: [
		{
			src: r.graphs.knn,
			alt: 'KNN classification results graph.',
			caption: 'KNN classification results. We tried a few other models.',
		},
	],
	cyclerInterval: 8000,
};

const resnetImages: JsonSectionImageSlot = {
	images: [
		{
			src: r.graphs.resnet,
			alt: 'Example of a ResNet classification model.',
			caption: 'Example of a ResNet classification model.',
		},
	],
	cyclerInterval: 0,
};

const metricsImages: JsonSectionImageSlot = {
	images: [
		{
			src: r.graphs.metrics,
			alt: 'Table of real-world performance metrics used to evaluate Recyclotron.',
			caption:
				'Table of real-world performance metrics used to evaluate Recyclotron.',
		},
		{
			src: r.graphs.sortingPerformance,
			alt: 'Real-world comparison of recycling performance.',
			caption: 'Real-world comparison of recycling performance.',
		},
	],
	cyclerInterval: 8000,
};

export {
	glassImages,
	hwImages,
	knnImages,
	metricsImages,
	planImages,
	resnetImages,
	useImages,
};
