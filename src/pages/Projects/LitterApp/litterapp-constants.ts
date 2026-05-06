import type { ProjectPanel } from '../../../types/basic.types';

const blurb = 'LitterApp, Location-based Social Media';

const panelData: Record<string, ProjectPanel> = {
	precursor: {
		title: 'intro',
		content: [
			'',
			'One course in third year was building a pathfinding app in Java.',
			'',
			'We had to build a simple, rules-based AI to return the optimal route around a map.',
			'It had to collect all coins and avoid hazards, in as few steps as possible.',
			'',
			'Using Java, I modelled the map and designed an algorithm to cover all the cases.',
			'It was a lot of fun, and I wondered if I could something similar next year...',
			'...which became my final year project!',
			'',
		],
	},
	premise: {
		title: "What is a 'location-based social media'?",
		content: [
			"The brief was to build a 'location-based social media'. But what does that mean?",
			'Anyone can make social media location-based by tying a post or message to a location.',
			'',
			'How could I make it interesting? I searched for inspiration.',
			'Two stuck out - Pokemon Go and Geocaching.',
			'',
			'The idea of discovery and exploration appealed to me.',
			'What if users had to discover messages?',
			'',
			'Only by getting closer does the message start to be decoded until it is fully revealed.',
			'So I made some mockups in Figma for WHAT I wanted. Now I started thinking of HOW to do it.',
		],
	},
	firebase: {
		title: 'Databases',
		content: [
			'I decided to store data in Cloud Firestore.',
			'As a NoSQL cloud database, this provided boilerplate CRUD operations.',
		],
	},
	kotlin: {
		title: 'kotlin',
		content: [''],
	},
	testing: {
		title: 'testing',
		content: [''],
	},
};

export { blurb, panelData };
