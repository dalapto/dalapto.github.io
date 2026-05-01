import { Tooltip } from '@mui/material';
import * as React from 'react';

interface TooltipLinkProps {
	href: string;
	text: string;
	imgSrc: string;
	placement?: 'left' | 'top' | 'bottom' | 'right';
}

function TooltipLink({
	href,
	text,
	imgSrc,
	placement = 'left',
}: TooltipLinkProps) {
	return (
		<Tooltip
			followCursor={false}
			placement={placement}
			slotProps={{
				tooltip: {
					sx: {
						backgroundColor: 'transparent',
						boxShadow: 'none',
						padding: 0,
						opacity: 1,
					},
				},
				popper: {
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [0, -1],
							},
						},
					],
				},
			}}
			title={<img width={25} height={25} src={imgSrc} />}
		>
			<a href={href} target='_blank' rel='noopener noreferrer'>
				<span>{text}</span>
			</a>
		</Tooltip>
	);
}

export { TooltipLink };
export type { TooltipLinkProps };
