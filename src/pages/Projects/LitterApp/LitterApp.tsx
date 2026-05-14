import React from 'react';
import type {
	JsonImageTextPanel,
	JsonTextPanelData,
} from '../../../components/JsonSection/JsonPanel';
import { JsonSection } from '../../../components/JsonSection/JsonSection';
import { colors } from '../../../constants/colors';
import { ImgPaths } from '../../../constants/img-paths';
import { formatLink, kotlinLink } from '../../../constants/link-constants';

const kotlin = formatLink(kotlinLink);

const headerPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: 'LitterApp',
		subtitleText: 'Location-based Social Media',
	},
	content: [],
};

const javaLink = {
	text: 'Java',
	link: 'https://www.java.com/en/download/help/whatis_java.html',
	img: ImgPaths.logo.java,
};
const java = formatLink(javaLink);

const powergrabLink = {
	text: 'here',
	link: 'https://github.com/dalapto/uni-powergrab',
};
const powergrab = formatLink(powergrabLink);

const aStarLink = {
	text: 'A* search algorithm',
	link: 'https://en.wikipedia.org/wiki/A*_search_algorithm',
};
const aStar = formatLink(aStarLink);

const precursorPanel: JsonImageTextPanel = {
	kind: 'image-text',
	content: [
		'',
		`One course in third year was building a pathfinding app in ${java}.`,
		`You can view the git repository for it ${powergrab}.`,
		'',
		'The goal was a simple, rules-based AI that returned the optimal route around a map.',
		'It had to collect all coins and avoid hazards, in as few steps as possible.',
		'',
		`To do this I modelled the map and implemented an ${aStar}.`,
		'The freedom and longing to create more inspired my final year project choice...',
		'',
		'...a <?Location-based Social Media Android App?>.',
		'',
	],
	imageSlot: {
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
	},
	contentBackground: colors.primary,
	maxWidth: '60%',
};

const pokemonLink = {
	text: 'Pokémon Go',
	link: 'https://pokemongo.com/en/map',
	img: ImgPaths.logo.pokemon,
};
const pokemonGo = formatLink(pokemonLink);

const geocachingLink = {
	text: 'Geocaching',
	link: 'https://www.geocaching.com/sites/education/en/frequently-asked-questions/',
	img: ImgPaths.logo.geocaching,
};
const geocaching = formatLink(geocachingLink);

const figmaLink = {
	text: 'Figma',
	link: 'https://www.figma.com/',
	img: ImgPaths.logo.figma,
};
const figma = formatLink(figmaLink);

const premisePanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: '"Location-based"?',
	},
	imageSlot: {
		images: [
			{
				src: ImgPaths.pages.litter.figma.createMockup,
				alt: 'Screenshot of create mockup in Figma.',
				caption: 'Create mockup in Figma.',
			},
			{
				src: ImgPaths.pages.litter.figma.mapMockup,
				alt: 'Screenshot of map mockup in Figma.',
				caption: 'Map mockup in Figma.',
			},
		],
		cyclerInterval: 6000,
	},
	reverseColumns: true,
	imageMaxWidth: '35%',
	minHeight: '60vh',
	content: [
		'I wanted a practical project, so I chose one on making an Android app.',
		'',
		'The brief was to build a <?"location-based"?> social media. But what does that mean?',
		'Anyone can make social media "location-based" by tying a post or message to a location.',
		'',
		'How could I make it interesting?',
		`I searched for inspiration and two ideas stuck out — ${pokemonGo} and ${geocaching}.`,
		'',
		'Their focus on discovery and exploration appealed to me.',
		'What if users had to discover messages by getting closer?',
		'',
		'Distant messages need decoded, only revealing themselves when you get closer.',
		`So I made some mockups in ${figma} for <!<?what?>!> I wanted.`,
		'Now I started thinking of <!<?how?>!> to do it.',
		'',
	],
	contentBackground: colors.primary,
};

const cloudFirestoreLink = {
	text: 'Cloud Firestore',
	link: 'https://firebase.google.com/docs/firestore',
	img: ImgPaths.logo.firebase,
};
const cloudFirestore = formatLink(cloudFirestoreLink);

const sqlLink = {
	text: 'SQL',
	link: 'https://en.wikipedia.org/wiki/SQL',
};
const sql = formatLink(sqlLink);

const noSqlLink = {
	text: 'NoSQL',
	link: 'https://en.wikipedia.org/wiki/NoSQL',
};
const noSql = formatLink(noSqlLink);

const crudLink = {
	text: 'CRUD',
	link: 'https://en.wikipedia.org/wiki/Create,_read,_update_and_delete',
};
const crud = formatLink(crudLink);

const apiLink = {
	text: 'API',
	link: 'https://en.wikipedia.org/wiki/API',
};
const api = formatLink(apiLink);

const firebasePanel: JsonImageTextPanel = {
	header: {
		titleText: '"Social Media"?',
	},
	imageSlot: {
		images: [
			{
				src: ImgPaths.pages.litter.data.userDetails,
				alt: 'Screenshot of user details in LitterApp.',
				caption: 'User details in LitterApp.',
			},
			{
				src: ImgPaths.pages.litter.data.cfMessages,
				alt: 'Screenshot of Firestore messages in LitterApp.',
				caption: 'Firestore messages in LitterApp.',
			},
			{
				src: ImgPaths.pages.litter.figma.createMockup,
				alt: 'Screenshot of create mockup in Figma.',
				caption: 'Create mockup in Figma.',
			},
			{
				src: ImgPaths.pages.litter.figma.mapMockup,
				alt: 'Screenshot of map mockup in Figma.',
				caption: 'Map mockup in Figma.',
			},
			{
				src: ImgPaths.pages.litter.figma.messageMockup,
				alt: 'Screenshot of message mockup in Figma.',
				caption: 'Message mockup in Figma.',
			},
			{
				src: ImgPaths.pages.litter.figma.messagesMockup,
				alt: 'Screenshot of messages mockup in Figma.',
				caption: 'Messages mockup in Figma.',
			},
			{
				src: ImgPaths.pages.litter.figma.oldMessageMockup,
				alt: 'Screenshot of old message mockup in Figma.',
				caption: 'Old message mockup in Figma.',
			},
		],
		cyclerInterval: 6000,
	},
	kind: 'image-text',
	content: [
		'',
		'The map acts as the public space, where users post messages for others to find.',
		"Once a user discovers a message they can 'like' and comment on it.",
		'',
		'Real social medias store and serve thousands of users and messages.',
		'How do you scale that?',
		'',
		`Rather than make my own ${sql} database from scratch, I used ${cloudFirestore}.`,
		'If I needed more storage or speed, I would just upgrade the subscription.',
		'',
		`It also comes with prebuilt, optimsed ${api}s for ${crud} and authentication.`,
		`And as ${noSql} is so flexible, I could easily extend the schema.`,
		'',
	],
	contentBackground: colors.primary,
	imageMaxWidth: '45%',
	maxWidth: '100%',
	minHeight: '60vh',
};

const kotlinPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: '"Android App"?',
	},
	imageSlot: {
		images: [
			{
				src: ImgPaths.pages.litter.app.logo,
				alt: 'Screenshot of LitterApp logo.',
				caption: 'LitterApp logo.',
			},
		],
		cyclerInterval: 5000,
	},
	imageMaxWidth: '30%',
	minHeight: '60vh',
	content: [
		'',
		'I used Google Maps SDK to handle user and message location logic.',
		`The app was built natively for Android using ${kotlin}.`,
		'',
		`${kotlin} is a modern, concise language that runs on the JVM.`,
		'It was a natural fit for Android development.',
		'',
		'',
	],
	contentBackground: colors.primary,
};

const markersPanel: JsonImageTextPanel = {
	kind: 'image-text',
	imageSlot: {
		images: [
			{
				src: ImgPaths.pages.litter.smaller.markerNew,
				alt: 'Screenshot of new marker in LitterApp.',
				caption: 'New marker in LitterApp.',
			},
			{
				src: ImgPaths.pages.litter.smaller.markerOld,
				alt: 'Screenshot of old marker in LitterApp.',
				caption: 'Old marker in LitterApp.',
			},
		],
		cyclerInterval: 4000,
	},
	reverseColumns: true,
	imageMaxWidth: '25%',
	content: [
		'',
		'Map markers evolved over the course of the project.',
		'',
		'Early markers were plain pins.',
		'Later iterations used custom icons with the LitterApp logo to give the map a distinct identity.',
		'',
	],
	contentBackground: colors.primary,
};

const testingPanel: JsonTextPanelData = {
	kind: 'text',
	content: [
		'',
		'Testing was split across unit and integration layers.',
		'',
		'Unit tests covered the core decoding logic — the algorithm that reveals messages as you approach.',
		'Integration tests covered the Firestore read/write paths.',
		'',
		'The project was assessed and awarded a First Class grade.',
		'',
	],
	contentBackground: colors.primary,
	maxWidth: '60%',
};

function LitterApp() {
	return (
		<JsonSection
			background={{
				image: {
					src: ImgPaths.pages.litter.app.background,
					alt: 'LitterApp background image.',
				},
				imagePosition: 'center center',
				imageFit: 'cover',
			}}
			gap='8rem'
			items={[
				headerPanel,
				{
					kind: 'group',
					panels: [precursorPanel, premisePanel],
				},
				{
					kind: 'group',
					panels: [firebasePanel, kotlinPanel, markersPanel],
				},
				testingPanel,
			]}
		/>
	);
}

export { LitterApp };
