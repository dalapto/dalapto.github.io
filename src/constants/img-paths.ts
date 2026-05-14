/**
 * Centralised image path constants mirroring the public/img/ folder structure.
 * All paths are absolute from the site root (Vite serves public/ at /).
 *
 * When assets are moved, update paths here — never hunt through component files.
 */

const IMG_ROOT = '/img';

export const ImgPaths = {
	bg: {
		bigzoom: `${IMG_ROOT}/bg/bigzoom.jpg`,
		m2: `${IMG_ROOT}/bg/m2.jpg`,
	},

	logo: {
		edi: `${IMG_ROOT}/logo/edi.png`,
		kotlin: `${IMG_ROOT}/logo/kotlin.png`,
		vb6: `${IMG_ROOT}/logo/vb6.png`,
		vite: `${IMG_ROOT}/logo/vite.png`,
		react: `${IMG_ROOT}/logo/react.webp`,
		ts: `${IMG_ROOT}/logo/ts.png`,
		mui: `${IMG_ROOT}/logo/mui.png`,
		gh: `${IMG_ROOT}/logo/gh.png`,
		pokemon: `${IMG_ROOT}/logo/pokeball.svg`,
		geocaching: `${IMG_ROOT}/logo/geocaching.png`,
		java: `${IMG_ROOT}/logo/java.png`,
		figma: `${IMG_ROOT}/logo/figma.svg`,
		firebase: `${IMG_ROOT}/logo/fs.png`,
	},

	pages: {
		home: {
			tile: {
				about: `${IMG_ROOT}/pages/home/tile/about.png`,
				blog: `${IMG_ROOT}/pages/home/tile/blog.png`,
				m2: `${IMG_ROOT}/pages/home/tile/m2.png`,
			},
		},

		about: {
			edi: `${IMG_ROOT}/pages/about/edi.jpeg`,
			at: `${IMG_ROOT}/pages/about/at.jpg`,
			labs: `${IMG_ROOT}/pages/about/labs.JPEG`,
			subs: `${IMG_ROOT}/pages/about/subs.JPEG`,
			vb6Ide: `${IMG_ROOT}/pages/about/vb6_ide.png`,
			wallSmile: `${IMG_ROOT}/pages/about/wall-smile.jpeg`,
			archMove: `${IMG_ROOT}/pages/about/arch-move.png`,
			archStill: `${IMG_ROOT}/pages/about/arch-still.jpeg`,
		},

		litter: {
			ilp: {
				map: `${IMG_ROOT}/pages/litter/ilp/map/map1.png`,
				class: `${IMG_ROOT}/pages/litter/ilp/diagrams/class.png`,
				flow: `${IMG_ROOT}/pages/litter/ilp/diagrams/flow.png`,
			},
			data: {
				userDetails: `${IMG_ROOT}/pages/litter/data/user_details.png`,
				cfMessages: `${IMG_ROOT}/pages/litter/data/cf_messages.png`,
			},
			app: {
				background: `${IMG_ROOT}/pages/litter/app/background.png`,
				logo: `${IMG_ROOT}/pages/litter/app/logo.png`,
				msgBackground: `${IMG_ROOT}/pages/litter/app/msgbackground.png`,
			},
			figma: {
				createMockup: `${IMG_ROOT}/pages/litter/figma/create_mockup.png`,
				mapMockup: `${IMG_ROOT}/pages/litter/figma/map_mockup.png`,
				messageMockup: `${IMG_ROOT}/pages/litter/figma/message_mockup.png`,
				messagesMockup: `${IMG_ROOT}/pages/litter/figma/messages_mockup.png`,
				oldMessageMockup: `${IMG_ROOT}/pages/litter/figma/old_message_mockup.png`,
			},
			smaller: {
				markerNew: `${IMG_ROOT}/pages/litter/smaller/marker_new.png`,
				markerOld: `${IMG_ROOT}/pages/litter/smaller/marker_old.png`,
				editMessageFrag: `${IMG_ROOT}/pages/litter/smaller/editmessage_frag.png`,
				mapFrag: `${IMG_ROOT}/pages/litter/smaller/map_frag.png`,
				messagesFrag: `${IMG_ROOT}/pages/litter/smaller/messages_frag.png`,
			},
			phone: {
				view_messages: `${IMG_ROOT}/pages/litter/phone/view_messages.png`,
			},
		},

		recylotron: {
			models: {
				onBins: `${IMG_ROOT}/pages/recylotron/3dmodels/onbins.png`,
				icon: `${IMG_ROOT}/pages/recylotron/3dmodels/icon.png`,
				frontView: `${IMG_ROOT}/pages/recylotron/3dmodels/frontview1.png`,
				backView: `${IMG_ROOT}/pages/recylotron/3dmodels/backview2.png`,
				closeup: `${IMG_ROOT}/pages/recylotron/3dmodels/closeup.png`,
				model3: `${IMG_ROOT}/pages/recylotron/3dmodels/model3.png`,
			},
			art: {
				concept1: `${IMG_ROOT}/pages/recylotron/art/concept1.jpg`,
				concept2: `${IMG_ROOT}/pages/recylotron/art/concept2.png`,
				highlight1: `${IMG_ROOT}/pages/recylotron/art/highlight1.png`,
			},
			photos: {
				entireSystem: `${IMG_ROOT}/pages/recylotron/photos/enitre system.jpg`,
				feedbackScreen: `${IMG_ROOT}/pages/recylotron/photos/feedback screen.jpg`,
				legoBody1: `${IMG_ROOT}/pages/recylotron/photos/legobody1.jpg`,
				legoBody2: `${IMG_ROOT}/pages/recylotron/photos/legobody2.jpg`,
				onBins: `${IMG_ROOT}/pages/recylotron/photos/on_bins.jpg`,
				rails: `${IMG_ROOT}/pages/recylotron/photos/rails.jpg`,
				railsSide: `${IMG_ROOT}/pages/recylotron/photos/rails_side.jpg`,
			},
		},

		recommendations: {
			books: `${IMG_ROOT}/pages/recommendations/books/`,
			film: `${IMG_ROOT}/pages/recommendations/film/`,
			music: `${IMG_ROOT}/pages/recommendations/music/`,
			podcasts: `${IMG_ROOT}/pages/recommendations/podcasts/`,
			tv: `${IMG_ROOT}/pages/recommendations/tv/`,
		},
	},
} as const;
