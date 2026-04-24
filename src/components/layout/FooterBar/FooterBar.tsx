import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import './FooterBar.css';
interface FooterBarProps {
	copyrightText?: string;
}

const tooltips = [
	{ text: 'Vite', link: 'https://vitejs.dev/', img: 'vite.png' },
	{ text: 'React', link: 'https://react.dev/', img: 'react.webp' },
	{
		text: 'TypeScript',
		link: 'https://www.typescriptlang.org/',
		img: 'ts.png',
	},
	{ text: 'Material UI', link: 'https://mui.com/', img: 'mui.png' },
	{ text: 'GitHub Pages', link: 'https://pages.github.com/', img: 'gh.png' },
];

const tooltipLinks = tooltips.map((tooltip) => (
	<span key={tooltip.text}>
		{tooltip.text != tooltips[tooltips.length - 1].text ? ' ' : ' and '}
		<br />
		<Tooltip
			followCursor={false}
			placement='left'
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
			title={
				<img width={25} height={25} src={`/img/logo/${tooltip.img}`}></img>
			}
		>
			<a href={tooltip.link} target='_blank' rel='noopener noreferrer'>
				<span>{tooltip.text}</span>
			</a>
		</Tooltip>
		{tooltip.text != tooltips[tooltips.length - 1].text ? ', ' : '.'}
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
					{tooltipLinks}
				</Typography>
			</Container>
		</AppBar>
	);
}

export { FooterBar };
