import { SvgIconComponent } from '@mui/icons-material';

interface Image {
	src: string;
	alt: string;
}

interface ExternalLink {
	href: string;
	label: string;
	icon: SvgIconComponent;
}

export { ExternalLink, Image };
