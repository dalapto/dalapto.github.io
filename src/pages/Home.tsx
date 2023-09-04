import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';

function Home() {
	return (
		<div className="App">
			<Container>
				<Box>
					<p></p>
					{/* need to change text dynamically to different languages */}
					<Typography variant="h1">Welcome</Typography>
				</Box>
				<Box>
					<Typography variant="h4">
						{/* icons & links for each package */}
						<p>
							Making websites is fun.<br></br>So I made this one.<br></br>It uses <span>vite</span>, <span>react-ts</span>, and <span>gh-pages</span>.
						</p>
					</Typography>
					<span>Feel free to look around.</span>
				</Box>
				{/* grid with 3 rows */}
				<Box>
					<span>about (me)</span>
					<span>projects (many)</span>
					<span>blog (hc)</span>
				</Box>
			</Container>
		</div>
	);
}
export default Home;
