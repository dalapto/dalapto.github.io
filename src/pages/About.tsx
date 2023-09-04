import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React from 'react';

function About() {
	return (
		<div className="App">
			<Container>
				<Box>
					<p></p>
					{/* need to change text dynamically to different languages */}
					<Typography variant="h3">
						<p>
							Hello.<br></br>That`s me.
						</p>
					</Typography>
				</Box>
				<Box>
					<Typography variant="h4">
						{/* parallax scroll down, contrast out the dog */}
						<p>Not the dog. That`s Bear.</p>
					</Typography>
				</Box>
				<Box>
					<span>I do not consider myself photogenic.</span>
				</Box>
				{/* discuss other avatars, parallax */}
			</Container>
		</div>
	);
}
export default About;
