import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

function About() {
	const alignCenter = { display: 'grid', alignItems: 'center' };
	return (
		<div className="App">
			<Container>
				<Parallax pages={4}>
					<ParallaxLayer sticky={{ start: 1, end: 2 }} style={{ ...alignCenter, justifyContent: 'left' }}>
						<Box
							component="img"
							src="/img/about/par1-brt.png"
							sx={{
								width: 300,
								height: 300,
							}}
						/>
					</ParallaxLayer>
					<ParallaxLayer sticky={{ start: 2, end: 2 }} style={{ ...alignCenter, justifyContent: 'left' }}>
						<Box
							component="img"
							src="/img/about/par2-bg.png"
							sx={{
								width: 300,
								height: 300,
							}}
						/>
					</ParallaxLayer>
					<ParallaxLayer sticky={{ start: 0, end: 3 }} speed={0} style={{ ...alignCenter, justifyContent: 'center' }}>
						<Container>
							<Box>
								<Typography variant="h3">
									{`Hello.`}
									<br></br>
									{`That's me.`}
								</Typography>
							</Box>
						</Container>
					</ParallaxLayer>

					<ParallaxLayer sticky={{ start: 1, end: 3 }} style={{ ...alignCenter, justifyContent: 'center', marginTop: '20%' }}>
						<Box>
							<Typography variant="h4">
								<p></p>
								<p>{`Not the dog. That's Bear.`}</p>
							</Typography>
						</Box>
					</ParallaxLayer>

					<ParallaxLayer sticky={{ start: 2, end: 3 }} style={{ ...alignCenter, justifyContent: 'center' }}>
						<Box>
							<Typography variant="h4">
								<p></p>
								<p>{`That's me.`}</p>
							</Typography>
						</Box>
						{/* discuss other avatars, parallax */}
					</ParallaxLayer>
					{/* 
					<ParallaxLayer offset={2.5} speed={1.5} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
						<span>I do not consider myself photogenic.</span>
					</ParallaxLayer> */}
				</Parallax>
			</Container>
		</div>
	);
}

export default About;
