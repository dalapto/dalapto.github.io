import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface SmartLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
}

function isInternal(href: string): boolean {
	return href.startsWith('/');
}

function SmartLink({ href, children, className }: SmartLinkProps) {
	if (isInternal(href)) {
		return (
			<Link to={href} className={className}>
				{children}
			</Link>
		);
	}
	return (
		<a
			href={href}
			target='_blank'
			rel='noopener noreferrer'
			className={className}
		>
			{children}
		</a>
	);
}

export { SmartLink, type SmartLinkProps };
