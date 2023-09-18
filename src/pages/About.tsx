import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { Card, CardMedia } from '@mui/material';

function About() {
	const alignCenter = { display: 'flex', alignItems: 'center' };
	return (
		<div className="App">
			<Container>
				<Parallax pages={5}>
					<ParallaxLayer offset={0} speed={0} style={{ ...alignCenter, justifyContent: 'center' }}>
						<Container>
							<Box>
								<Card>
									<CardMedia image="/img/about/par1-brt.png" />
								</Card>
								<Typography variant="h3">
									{`Hello.`}
									<br></br>
									{`That's me.`}
								</Typography>
							</Box>
						</Container>
					</ParallaxLayer>

					<ParallaxLayer sticky={{ start: 1, end: 3 }} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
						<Box>
							<Typography variant="h4">
								{/* parallax scroll down, contrast out the dog */}
								<p>{`Not the dog. That's Bear.`}</p>
							</Typography>
						</Box>
					</ParallaxLayer>

					<ParallaxLayer offset={1.5} speed={1.5} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
						<Box>
							<span>I do not consider myself photogenic.</span>
						</Box>
						{/* discuss other avatars, parallax */}
					</ParallaxLayer>

					<ParallaxLayer offset={2.5} speed={1.5} style={{ ...alignCenter, justifyContent: 'flex-end' }}>
						<p>Neither am I</p>
					</ParallaxLayer>
				</Parallax>
			</Container>
		</div>
	);
}

export default About;
