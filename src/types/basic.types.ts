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
	/** When true (default with icon), only the icon shows on mobile. Set false to keep label + icon. */
	mobileIconOnly?: boolean;
	/** Semantic colour override for this button. */
	color?: 'danger' | 'success' | 'warning' | 'info';
}

type HeaderActions =
	| ActionConfig[]
	| { start?: ActionConfig[]; startSecondary?: ActionConfig[]; end?: ActionConfig[] };

function resolveHeaderActions(h?: HeaderActions): {
	start: ActionConfig[];
	startSecondary: ActionConfig[];
	end: ActionConfig[];
} {
	if (!h) return { start: [], startSecondary: [], end: [] };
	if (Array.isArray(h)) return { start: [], startSecondary: [], end: h };
	return {
		start: h.start ?? [],
		startSecondary: h.startSecondary ?? [],
		end: h.end ?? [],
	};
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
