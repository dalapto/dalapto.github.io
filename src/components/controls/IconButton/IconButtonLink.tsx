import { SvgIcon } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './IconButtonLink.css';

interface BaseIconButtonProps {
	icon: typeof SvgIcon;
	style?: React.CSSProperties;
}

interface ExternalLinkProps extends BaseIconButtonProps {
	href: string;
	to?: never;
	ariaLabel: string;
}

interface InternalLinkProps extends BaseIconButtonProps {
	to: string;
	href?: never;
	ariaLabel: string;
}

type IconButtonLinkProps = ExternalLinkProps | InternalLinkProps;

function IconButtonLink({
	icon: Icon,
	style,
	href,
	to,
	ariaLabel,
	...delegated
}: IconButtonLinkProps) {
	const linkStyle: React.CSSProperties = {
		...style,
	};

	if (href) {
		return (
			<a
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				aria-label={ariaLabel}
				className='icon-button-link'
				style={linkStyle}
				{...delegated}
			>
				<Icon sx={style} />
			</a>
		);
	}

	return (
		<Link
			to={to!}
			aria-label={ariaLabel}
			className='icon-button-link'
			style={linkStyle}
			{...delegated}
		>
			<Icon sx={style} />
		</Link>
	);
}
export { IconButtonLink };
