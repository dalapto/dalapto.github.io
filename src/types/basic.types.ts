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

interface ActionConfig {
	id: string;
	label: string;
	variant: 'outlined' | 'contained';
	onClick: () => void;
	icon?: React.ReactElement;
	disabled?: boolean;
	/** When true the button is not rendered. Replaces conditional JSX like {hasContent && <ClearButton />}. */
	hidden?: boolean;
	mobileIconOnly?: boolean;
}

type HeaderActions =
	| ActionConfig[]
	| { start?: ActionConfig[]; end?: ActionConfig[] };

function resolveHeaderActions(h?: HeaderActions): {
	start: ActionConfig[];
	end: ActionConfig[];
} {
	if (!h) return { start: [], end: [] };
	if (Array.isArray(h)) return { start: [], end: h };
	return { start: h.start ?? [], end: h.end ?? [] };
}

export {
	ExternalLink,
	Image,
	ProjectPanel,
	TooltipLink,
	resolveHeaderActions,
	type ActionConfig,
	type HeaderActions,
	type JsonTab,
};
