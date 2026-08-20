import { Box, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
import { colours } from '../../../constants/colours';
import { CoverLetterForm } from './CoverLetterForm';

function CoverLetterGenerator() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const coverLetterPanel = (
		<Box
			key='cover-letter-panel'
			sx={{
				width: { xs: '100%', sm: 'fit-content' },
				maxWidth: '100%',
				mx: 'auto',
			}}
		>
			<Box
				sx={{
					backgroundColor: colours.primary,
					padding: '1rem',
					minWidth: '100%',
					boxSizing: 'border-box',
				}}
			>
				<CoverLetterForm />
			</Box>
		</Box>
	);

	return (
		<JsonSection
			items={[coverLetterPanel]}
			gap='8rem'
			paddingTop={isMobile ? '0.25rem' : '1rem'}
			paddingBottom='2rem'
		/>
	);
}

export { CoverLetterGenerator };
