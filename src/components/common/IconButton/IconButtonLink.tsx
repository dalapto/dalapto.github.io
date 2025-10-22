import * as React from 'react';
import { SvgIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import './IconButtonLink.css';

interface BaseIconButtonProps {
	icon: typeof SvgIcon;
	style?: React.CSSProperties;
}

interface ExternalLinkProps extends BaseIconButtonProps {
	href: string;
	to?: never;
}

interface InternalLinkProps extends BaseIconButtonProps {
	to: string;
	href?: never;
}

type IconButtonLinkProps = ExternalLinkProps | InternalLinkProps;

function IconButtonLink({ icon: Icon, style, href, to, ...delegated }: IconButtonLinkProps) {
	const linkStyle: React.CSSProperties = {
		...style,
	};
	
	if (href) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" className="icon-button-link" style={linkStyle} {...delegated}>
				<Icon sx={style} />
			</a>
		);
	}
	
	return (
		<Link to={to!} className="icon-button-link" style={linkStyle} {...delegated}>
			<Icon sx={style} />
		</Link>
	);
}
export default IconButtonLink;
