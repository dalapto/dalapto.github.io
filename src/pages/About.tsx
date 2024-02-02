import React from 'react';

function About() {
	const alignCenter = { display: 'grid', alignItems: 'center' };
	return (
		<>
			<div className="App" style={{ backgroundColor: '#7F7164' }}>
				<figure style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
					<img src="/img/about/arch-move.png" width={'40%'} />
					<div className="divider" style={{ height: '100%' }} />
					<figcaption style={{ width: '40%' }}>
						<p>
							My name is David McAlister. I'm a Software Developer with a Computer Science background. <br></br>I am currently upskilling in{' '}
							<strong>React + TypeScript</strong>, in and out of my job.
						</p>
						<p>
							I'm looking to specialise in Front-End Web Development.<br></br> I'm excited to learn more of what JavaScript, CSS & HTML can do.
						</p>
						<p>
							When not creating software, I'm usually creating something else. I love cooking, writing and modding video games. My idea of a good holiday is a good
							book, good food and long walks by the sea.
						</p>
					</figcaption>
				</figure>
			</div>
		</>
	);
}

export default About;
