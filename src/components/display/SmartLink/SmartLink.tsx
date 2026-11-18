import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { toSafeHref } from '../../../utils/safe-href';

interface SmartLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
}

/**
 * Internal paths use the router; external links open in a new tab. Links
 * with a disallowed scheme (e.g. `javascript:`) render as plain text, since
 * hrefs here can come from gist content.
 */
function SmartLink({ href, children, className }: SmartLinkProps) {
	const safe = toSafeHref(href);

	if (!safe) {
		return <span className={className}>{children}</span>;
	}
	if (safe.kind === 'internal') {
		return (
			<Link to={safe.href} className={className}>
				{children}
			</Link>
		);
	}
	return (
		<a
			href={safe.href}
			target='_blank'
			rel='noopener noreferrer'
			className={className}
		>
			{children}
		</a>
	);
}

export { SmartLink, type SmartLinkProps };
