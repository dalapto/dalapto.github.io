const podcasts = [
	{
		text: 'Fall of Civilizations',
		link: 'https://fallofcivilizationspodcast.com/',
		img: 'fall_of_civs.jpg',
	},
	{
		text: 'History of Rome',
		link: 'https://thehistoryofrome.typepad.com/',
		img: 'The_History_of_Rome.png',
	},
	{
		text: 'The Rest is History',
		link: 'https://therestishistory.com/episodes/',
		img: 'rest_is_hist.jpg',
	},
];

const blurb = '(how I became a Software Engineer)';

const uni_translations = {
	uni: 'University of Edinburgh',
	subject: 'BSc Computer Science',
	grade: '1st',
	before_uni: [
		'My first real taste of the SDLC was in school.',
		'Using VB6, I built a bookkeeping app for a local book shop, documenting the entire process.',
		'I spent a couple days writing out two dozen if-statements, just to switch between currencies.',
		'',
		'Thankfully, that code has been lost to time.',
		'',
		'After the fun of building my own app, I switched my university application from Chemistry to Computer Science.',
		'This meant next year was getting my Maths A-level (which I had skipped) to meet requirements...',
		'',
		'...so my gap year was spent between a call centre job and trigonometry! 📐',
	],
	at_uni: [
		'I fumbled first and second year of uni, having to resit multiple exams. Every course was boring and hard. I often fell asleep in morning lectures. But those two years taught me the life-skills I needed to study well.',
		'So, come year 3, I knew how to knuckle down. It helped that now, not only did the courses go towards my final grade, but I was also able to choose areas I was actually interested in. It mattered now.',
		"Then, come March 2020 - everything stopped. I flew back home, unsure what this coronavirus pandemic meant. When it became obvious this was no Spring thing, I cancelled the flat lease, unsure when I would return. My brother came to sort through all my things I had left behind. I wouldn't see them for another 2 years.",
		'It was a good time to finish my degree. I had swapped socialising for studying and besides, the Informatics department was well equipped to deliver and assess us virtually. Even if lots of lecturers recycled their old lecture recordings...',
	],
	recyclotron: {
		title: 'Recyclotron',
		content:
			"There was also a 'build-us-a-robot' course. Our group decided to make an auto-sorting bin. We trained our NN AI on images of rubbish. As I had 4 other courses on-the-go, I decided to manage the team of ten and writeup reports. We had some smart cookies.",
	},
	litter: {
		title: 'Litter',
		subtitle: 'Location-based Social Media App',
		content1:
			'One course in third year was creating a rules-based pathfinding AI in Java. This was a hoot and I wondered if I could expand on this for my final year project...',
		content2: 'Luckily for me the course lecturer had such a project!',
		content3:
			'I was to create a location-based social media app, using Kotlin. I go into more detail here. It was a lot of fun.',
	},
};

export { blurb, podcasts, uni_translations };
