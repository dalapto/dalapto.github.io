import { SvgIconComponent } from '@mui/icons-material';

interface Image {
	src: string;
	alt: string;
	caption?: string;
}

interface ExternalLink {
	href: string;
	label: string;
	icon: SvgIconComponent;
}

interface TooltipLink {
	text: string;
	link: string;
	img: string;
}

export { ExternalLink, Image, TooltipLink };
