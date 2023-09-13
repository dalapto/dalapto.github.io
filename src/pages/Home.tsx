import { Box, Card, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';

function Home() {
	return (
		<div className="App">
			<Container>
				<Box>
					<p></p>
					{/* need to change text dynamically to different languages */}
					<Typography variant="h2">Welcome</Typography>
				</Box>
				<Box>
					<Typography variant="h4">
						{/* icons & links for each package */}
						<p>
							Making websites is fun.<br></br>So I made this one.<br></br>It uses <span>vite</span>, <span>react-ts</span>, and <span>gh-pages</span>.
						</p>
					</Typography>
					<span>Feel free to look around.</span>
					<p></p>
				</Box>
				<Box>
					{/* grid with 3 rows */}
					<Grid container columnSpacing={3} justifyContent="center">
						<Grid item>
							<Card>
								<CardMedia image="../src/img/tile-aboutmehome.png" sx={{ width: 300, height: 300 }}>
									<Stack spacing={16}>
										<Box></Box>
										<Typography variant="h4" letterSpacing={3.5} justifyItems="center" alignContent="center" color="white">
											About Me
										</Typography>
										<Box></Box>
									</Stack>
								</CardMedia>
							</Card>
						</Grid>
						<Grid item>
							<Card>
								<CardMedia image="../src/img/tile-m2home.png" sx={{ width: 300, height: 300 }} />
								<CardContent>
									<span>projects (many)</span>
								</CardContent>
							</Card>
						</Grid>

						<Grid item>
							<Card>
								<CardMedia image="../src/img/tile-bloghome.png" sx={{ width: 300, height: 300 }} />
								<CardContent>
									<span>blog (many)</span>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</div>
	);
}
export default Home;
