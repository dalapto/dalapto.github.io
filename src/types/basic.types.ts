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

interface ProjectPanel {
	title: string;
	subtitle?: string;
	content: string[];
}

type JsonTab = {
	id: string;
	label: string;
	content: React.ReactNode;
	icon?: string | React.ReactElement;
};

export { ExternalLink, Image, ProjectPanel, TooltipLink, type JsonTab };
