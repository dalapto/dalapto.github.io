import React from 'react';
import projectsPanel from '../../../components/content/projectsPanel';
import type { JsonImageTextPanel } from '../../../components/JsonSection/JsonPanel';
import { JsonSection } from '../../../components/JsonSection/JsonSection';
import { colors } from '../../../constants/colors';
import { ImgPaths } from '../../../constants/img-paths';
import {
	androidLink,
	androidStudioLink,
	apiLink,
	aStarLink,
	cloudFirestoreLink,
	compilerLink,
	crudLink,
	emulatorLink,
	figmaLink,
	formatLink,
	geocachingLink,
	googleMapsSDKLink,
	javaLink,
	javascriptLink,
	jvmLink,
	kotlinLink,
	litterAppGithubLink,
	noSqlLink,
	pokemonLink,
	powergrabLink,
	sqlLink,
	typescriptLink,
	userJourneyLink,
} from '../../../constants/link-constants';
import {
	firebaseImages,
	precursorImages,
	premiseImages,
	testingImages,
	uiImages,
} from './litterapp-constants';

const android = formatLink(androidLink);
const androidStudio = formatLink(androidStudioLink);
const compiler = formatLink(compilerLink);
const emulator = formatLink(emulatorLink);
const java = formatLink(javaLink);
const javascript = formatLink(javascriptLink);
const jvm = formatLink(jvmLink);
const kotlin = formatLink(kotlinLink);
const powergrab = formatLink(powergrabLink);
const typescript = formatLink(typescriptLink);
const aStar = formatLink(aStarLink);
const pokemonGo = formatLink(pokemonLink);
const geocaching = formatLink(geocachingLink);
const googleMapsSDK = formatLink(googleMapsSDKLink);
const figma = formatLink(figmaLink);
const cloudFirestore = formatLink(cloudFirestoreLink);
const sql = formatLink(sqlLink);
const noSql = formatLink(noSqlLink);
const crud = formatLink(crudLink);
const api = formatLink(apiLink);
const userJourney = formatLink(userJourneyLink);
const litterAppGithub = formatLink(litterAppGithubLink);

const headerPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: 'LitterApp',
		subtitleText: 'Location-based Social Media',
	},
	content: [],
};

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
	imageSlot: precursorImages,
	contentBackground: colors.primary,
	maxWidth: '60%',
};

const premisePanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: {
		titleText: '"Location-Based"?',
	},
	imageSlot: premiseImages,
	reverseColumns: true,
	imageMaxWidth: '35%',
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

const firebasePanel: JsonImageTextPanel = {
	imageSlot: firebaseImages,
	kind: 'image-text',
	content: [
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
};

const kotlinPanel: JsonImageTextPanel = {
	kind: 'image-text',
	header: { titleText: 'Android Development' },
	content: [
		'',
		`I'd never made an ${android} app before, and had to teach myself.`,
		'',
		`Thankfully Android development is very developer-friendly with ${androidStudio}.`,
		`As I don't have an Android phone, the built-in ${emulator} meant I could debug on my laptop.`,
		'',
		`${kotlin} was really smooth to code in. Kotlin is to ${java}, what ${typescript} is to ${javascript}.`,
		'',
		`The ${jvm} makes me wonder if LitterApp ${compiler} and run in a web browser...`,
		'',
	],
	contentBackground: colors.primary,
};

const uiPanel: JsonImageTextPanel = {
	kind: 'image-text',
	imageSlot: uiImages,
	stackImage: true,
	stackImageMaxWidth: '70%',
	content: [
		'',
		`${googleMapsSDK} was the obvious choice for map functionality.`,
		'',
		'The map acts as the public space, where users post messages for others to find.',
		'Once a user discovers a message they can interact with it normally.',
		'',
		`Users can also 'keep' a message for later and comment on it.`,
		'',
	],
	contentBackground: colors.primary,
};

const testingPanel: JsonImageTextPanel = {
	kind: 'image-text',
	imageSlot: testingImages,
	content: [
		'',
		'I gathered feedback for the app user testing.',
		'',
		'As this was over lockdown, I screen-shared a fresh version of the app.',
		"I gave them various goals to do, like 'view a message' or 'make a post'.",
		'',
		`I directed them as little as possible, so I could observe their ${userJourney} more naturally.`,
		'I then asked them questions based on the goals, on a scale of 1 to 5.',
		'',
		'My work was evaluated through presentations and a project report.',
		'I scored highly and ended up getting a First-class degree!',
		'',
		`You can view both code and report ${litterAppGithub}.`,
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
					panels: [firebasePanel, kotlinPanel, uiPanel, testingPanel],
				},
				projectsPanel,
			]}
		/>
	);
}

export { LitterApp };
