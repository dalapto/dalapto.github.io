import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Container } from '@mui/system';
import React from 'react';
import Tile from '../components/Tile';
import TypedText from '../components/TypedText';

function Home() {
	const pages = [
		{ name: 'About Me', route: 'about', img: 'about' },
		{ name: 'Projects', route: 'projects', img: 'm2' },
		{ name: 'Blog', route: 'blog', img: 'blog' },
	];
	const tooltips = [
		{ text: 'Vite', link: 'https://vitejs.dev/', img: 'vite.png' },
		{ text: 'React', link: 'https://react.dev/', img: 'react.webp' },
		{ text: 'TypeScript', link: 'https://www.typescriptlang.org/', img: 'ts.png' },
		{ text: 'Material UI', link: 'https://mui.com/', img: 'mui.png' },
		{ text: 'GitHub Pages', link: 'https://pages.github.com/', img: 'gh.png' },
	];

	const welcomes = [
		'welcome',
		'fáilte',
		'croeso',
		'bienvenue',
		'willkommen',
		'bienvenido',
		'ようこそ',
		'welkom',
		'chào mừng',
		'benvenuta',
		'欢迎',
		'mirë se erdhe',
		'tervetuloa',
		'welina',
		'خوش آمدید',
		'välkommen',
		'добро пожаловать',
		'olandiridwa',
		'환영',
		'Прошу',
		'mile widziany',
		'tunngasugit',
		'vitaj',
		'ברוך הבא',
		'selamat datang',
		'nabata',
		'laipni lūdza',
		'स्वागत है',
		'maraba',
		'hoş geldin',
		'مەرھابا',
		'byenvini',
		'merħba',
		`tun'ngahuktitauyut`,
		'vælkomin',
		'kαλώς ήρθες',
		'أهلًا وسهلًا',
		'benvingut',
		'wamkelekile',
		'歡迎',
	];

	return (
		<div className="App">
			<Container>
				<Box marginTop={'5%'}>
					{/* changes text dynamically to different languages */}
					<Typography variant="h2" fontFamily={'monospace'} letterSpacing={5}>
						<TypedText string_list={welcomes} />
					</Typography>
				</Box>
				<Box marginTop={'5%'}>
					<Typography variant="h4">
						{/* icons & links for each package */}
						Making websites is fun.<br></br>So I made this one. <br></br>
						<Typography fontSize={'1.6rem'} fontFamily={'monospace'}>
							<span>It uses</span>
							{tooltips.map((tooltip) => (
								<span key={tooltip.text}>
									{tooltip.text != tooltips[tooltips.length - 1].text ? ' ' : ' and '}
									<Tooltip followCursor={true} placement="top" title={<img width={25} height={25} src={`/img/logo/${tooltip.img}`}></img>}>
										<a href={tooltip.link} target="_blank" rel="noopener noreferrer">
											<span>{tooltip.text}</span>
										</a>
									</Tooltip>
									{tooltip.text != tooltips[tooltips.length - 1].text ? ', ' : '.'}
								</span>
							))}
						</Typography>
					</Typography>
					<span>Feel free to look around.</span>
				</Box>
				<Box marginTop={'5%'}>
					{/* Tiles to other pages */}
					<Grid container columnSpacing={pages.length} justifyContent="center">
						{pages.map((page) => (
							<Grid key={page.route} item>
								<Link to={`/${page.route}`}>
									<Tile
										image_path={`/img/tile/${page.img}.png`}
										text={page.name}
										imgWidth={300}
										imgHeight={300}
										blurValue={1}
										opacityValue={0.7}
										growFromValue={0.85}
										backgroundColour={'rgb(0,0,0,0)'}
									/>
								</Link>
							</Grid>
						))}
					</Grid>
				</Box>
			</Container>
		</div>
	);
}
export default Home;
