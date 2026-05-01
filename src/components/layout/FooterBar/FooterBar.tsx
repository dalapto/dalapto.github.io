import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { tooltipLinks } from '../../../constants/link-constants';
import { TooltipLink } from '../../display/TooltipLink/TooltipLink';
import './FooterBar.css';

interface FooterBarProps {
	copyrightText?: string;
}

const tooltipTextList = tooltipLinks.map((tooltip) => (
	<span key={tooltip.text}>
		{tooltip.text != tooltipLinks[tooltipLinks.length - 1].text ? ' ' : ' and '}
		<br />
		<TooltipLink
			href={tooltip.link}
			text={tooltip.text}
			imgSrc={`/img/logo/${tooltip.img}`}
		/>
		{tooltip.text != tooltipLinks[tooltipLinks.length - 1].text ? ', ' : '.'}
	</span>
));

function FooterBar({ copyrightText }: FooterBarProps) {
	return (
		<AppBar id='footerbar' position='static' component='footer'>
			<Container
				maxWidth={false}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-center',
					justifyContent: 'center',
					padding: '5vh',
				}}
			>
				{/* icons & links for each package */}
				<Typography fontSize={'1.1rem'} fontFamily={'monospace'}>
					<span>This page is built with</span>
					{tooltipTextList}
				</Typography>
			</Container>
		</AppBar>
	);
}

export { FooterBar };
