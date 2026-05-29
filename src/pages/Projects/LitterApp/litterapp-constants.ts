import type { JsonSectionImageSlot } from '../../../components/JsonSection/JsonPanel';
import { ImgPaths } from '../../../constants/img-paths';

const precursorImages: JsonSectionImageSlot = {
	images: [
		{
			src: ImgPaths.pages.litter.ilp.map,
			alt: 'Screenshot of the precursor map in LitterApp.',
			caption: 'Render of the map with a route.',
		},
		{
			src: ImgPaths.pages.litter.ilp.class,
			alt: 'Screenshot of the precursor class diagram in LitterApp.',
			caption: 'Class diagram of the powergrab project.',
		},
		{
			src: ImgPaths.pages.litter.ilp.flow,
			alt: 'Screenshot of the precursor flow diagram in LitterApp.',
			caption: 'Flow diagram of the pathfinding algorithm.',
		},
	],
	cyclerInterval: 10000,
};

const premiseImages: JsonSectionImageSlot = {
	images: [
		{
			src: ImgPaths.pages.litter.mockups.map,
			alt: 'Figma mockup for map, showing how messages are decoded.',
			caption: 'Figma mockup for map, showing how messages are decoded',
		},
		{
			src: ImgPaths.pages.litter.mockups.message,
			alt: 'Figma mockup of user creating a message.',
			caption: 'Figma mockup of users viewing and creating messages.',
		},
		{
			src: ImgPaths.pages.litter.mockups.list,
			alt: 'Figma mockup for list of messages user has discovered.',
			caption: 'Figma mockup for list of messages user has discovered.',
		},
	],
	cyclerInterval: 6000,
};

const firebaseImages: JsonSectionImageSlot = {
	images: [
		{
			src: ImgPaths.pages.litter.data.emails,
			alt: 'Screenshot of authentication details in Firestore. I wanted this data separate and secure from other metadata.',
			caption:
				'Authentication details in Firestore. I wanted this data separate and secure from other metadata.',
		},
		{
			src: ImgPaths.pages.litter.data.messages,
			alt: 'Screenshot of Firestore messages collection. Location is just a simple dictionary.',
			caption:
				'What messages data looks like in Firestore. Location is just a simple dictionary.',
		},
		{
			src: ImgPaths.pages.litter.data.users,
			alt: 'Screenshot of Firestore users collection.',
			caption: 'What user data looks like in Firestore.',
		},
	],
	cyclerInterval: 6000,
};

const uiImages: JsonSectionImageSlot = {
	images: [
		{
			src: ImgPaths.pages.litter.ui.tabs,
			alt: 'Screenshot of the tab navigation in LitterApp.',
			caption: 'There were three different tabs; Map, Messages and Settings.',
		},
		{
			src: ImgPaths.pages.litter.ui.explore,
			alt: 'Screenshot of the how messages are discovered and decoded based on distance.',
			caption: 'Decoding messages was simple.',
		},
		{
			src: ImgPaths.pages.litter.ui.list,
			alt: 'Screenshot of messages in a list.',
			caption:
				'A list of messages was a concise way for users to locate and interact with messages.',
		},
		{
			src: ImgPaths.pages.litter.ui.filters,
			alt: 'Screenshot of user filtering out unseen messages.',
			caption:
				'If a map was too cluttered, users could filter out messages by state. Meaning they could hide seen messages for example.',
		},
		{
			src: ImgPaths.pages.litter.ui.review,
			alt: 'Screenshot of user creating a message.',
			caption:
				'Users could create either a text or an image message. They could also edit it later.',
		},
		{
			src: ImgPaths.pages.litter.ui.view,
			alt: 'Screenshot of messages being viewed.',
			caption: 'Users could view decoded messages anytime.',
		},
		{
			src: ImgPaths.pages.litter.ui.comments,
			alt: 'Screenshot of a comments section.',
			caption: 'Users could comment on messages.',
		},
		{
			src: ImgPaths.pages.litter.ui.keep,
			alt: 'Screenshot of what keep messages looked like.',
			caption: 'Users could keep messages they approved of.',
		},
	],
	cyclerInterval: 6000,
	cyclerMinHeight: '70vh',
};

const testingImages: JsonSectionImageSlot = {
	images: [
		{
			src: ImgPaths.pages.litter.testing.qs,
			alt: 'Questionnaire given to users during testing.',
			caption: 'Questionnaire given to users during testing.',
		},
		{
			src: ImgPaths.pages.litter.testing.feedback,
			alt: 'Screenshot of comments UI before and after feedback on colour contrast.',
			caption: 'I got helpful bits of feedback like poor colour contrast for comments text.',
		},
		{
			src: ImgPaths.pages.litter.testing.zoom,
			alt: 'Four photos in a square, each with photo of an animal awkardly looking head-on at camera. Meme caption reads "me and my coworkers logging into all of our meetings remotely for the next couple of weeks". A sample meme give users could post during testing.',
			caption: 'A sample meme give users could post during testing.',
		},
	],
};

export { firebaseImages, precursorImages, premiseImages, testingImages, uiImages };
