import { Tooltip } from '@mui/material';
import * as React from 'react';
import { SmartLink } from '../SmartLink/SmartLink';

interface TooltipLinkProps {
	href: string;
	text: string;
	imgSrc: string;
	placement?: 'left' | 'top' | 'bottom' | 'right';
	offset?: number[];
}

function TooltipLink({
	href,
	text,
	imgSrc,
	placement = 'left',
	offset = [0, -1],
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
								offset: offset,
							},
						},
					],
				},
			}}
			title={<img width={25} height={25} src={imgSrc} />}
		>
			<span>
				<SmartLink href={href}>{text}</SmartLink>
			</span>
		</Tooltip>
	);
}

export { TooltipLink, TooltipLinkProps };
