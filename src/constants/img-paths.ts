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
		android: `${IMG_ROOT}/logo/android.ico`,
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

		clipboard: {
			graffiti: `${IMG_ROOT}/pages/clipboard/graffiti.jpeg`,
			floorplan: `${IMG_ROOT}/pages/clipboard/floorplan.jpg`,
			windowapple: `${IMG_ROOT}/pages/clipboard/windowapple.jpeg`,
		},

		litter: {
			app: {
				background: `${IMG_ROOT}/pages/litter/app/background.png`,
				logo: `${IMG_ROOT}/pages/litter/app/logo.png`,
				msgBackground: `${IMG_ROOT}/pages/litter/app/msgbackground.png`,
			},
			data: {
				emails: `${IMG_ROOT}/pages/litter/data/emails.png`,
				messages: `${IMG_ROOT}/pages/litter/data/messages.png`,
				users: `${IMG_ROOT}/pages/litter/data/users.png`,
			},
			ilp: {
				class: `${IMG_ROOT}/pages/litter/ilp/class.png`,
				flow: `${IMG_ROOT}/pages/litter/ilp/flow.png`,
				map: `${IMG_ROOT}/pages/litter/ilp/map.png`,
			},
			mockups: {
				list: `${IMG_ROOT}/pages/litter/mockups/list.png`,
				map: `${IMG_ROOT}/pages/litter/mockups/map.png`,
				message: `${IMG_ROOT}/pages/litter/mockups/message.png`,
			},
			phone: {
				create: `${IMG_ROOT}/pages/litter/phone/create.png`,
				far: `${IMG_ROOT}/pages/litter/phone/far.png`,
			},
			testing: {
				feedback: `${IMG_ROOT}/pages/litter/testing/feedback.png`,
				qs: `${IMG_ROOT}/pages/litter/testing/qs.png`,
				zoom: `${IMG_ROOT}/pages/litter/testing/zoom.jpg`,
			},
			ui: {
				auth: `${IMG_ROOT}/pages/litter/ui/auth.png`,
				comments: `${IMG_ROOT}/pages/litter/ui/comments.png`,
				create: `${IMG_ROOT}/pages/litter/ui/create.png`,
				explore: `${IMG_ROOT}/pages/litter/ui/explore.png`,
				filters: `${IMG_ROOT}/pages/litter/ui/filters.png`,
				keep: `${IMG_ROOT}/pages/litter/ui/keep.png`,
				list: `${IMG_ROOT}/pages/litter/ui/list.png`,
				markers: `${IMG_ROOT}/pages/litter/ui/markers.png`,
				review: `${IMG_ROOT}/pages/litter/ui/review.png`,
				tabs: `${IMG_ROOT}/pages/litter/ui/tabs.png`,
				view: `${IMG_ROOT}/pages/litter/ui/view.png`,
			},
		},

		recylotron: {
			background: `${IMG_ROOT}/pages/recylotron/background.png`,
			icon: `${IMG_ROOT}/pages/recylotron/icon.png`,
			logo: `${IMG_ROOT}/pages/recylotron/logo.png`,
			graphs: {
				cmatrix: `${IMG_ROOT}/pages/recylotron/graphs/cmatrix.png`,
				knn: `${IMG_ROOT}/pages/recylotron/graphs/knn.png`,
				metrics: `${IMG_ROOT}/pages/recylotron/graphs/metrics.png`,
				purity: `${IMG_ROOT}/pages/recylotron/graphs/purity.png`,
				resnet: `${IMG_ROOT}/pages/recylotron/graphs/resnet.png`,
				sortingPerformance: `${IMG_ROOT}/pages/recylotron/graphs/sortingperformance.png`,
			},
			hw: {
				back: `${IMG_ROOT}/pages/recylotron/hw/back.png`,
				front: `${IMG_ROOT}/pages/recylotron/hw/front.png`,
				lego1: `${IMG_ROOT}/pages/recylotron/hw/lego1.jpg`,
				lego2: `${IMG_ROOT}/pages/recylotron/hw/lego2.jpg`,
			},
			plan: {
				gant: `${IMG_ROOT}/pages/recylotron/plan/gant.png`,
				rails: `${IMG_ROOT}/pages/recylotron/plan/rails.png`,
				trapdoor: `${IMG_ROOT}/pages/recylotron/plan/trapdoor.jpg`,
			},
			use: {
				flow: `${IMG_ROOT}/pages/recylotron/use/flow.png`,
				step1: `${IMG_ROOT}/pages/recylotron/use/step1.png`,
			},
			other: {
				model1: `${IMG_ROOT}/pages/recylotron/other/model1.png`,
				rails: `${IMG_ROOT}/pages/recylotron/other/rails.jpg`,
				photo2: `${IMG_ROOT}/pages/recylotron/other/photo2.jpg`,
				feedback: `${IMG_ROOT}/pages/recylotron/other/feedback.jpg`,
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
