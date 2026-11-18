import { Box } from '@mui/material';
import { StandardTextField } from '../../../components/controls/StandardTextField/StandardTextField';
import type { HiddenStatus } from '../../../hooks/usePointerGistHidden';
import { clampOrderInput } from '../../../utils/pointer-gist-articles';
import { HiddenCheckbox } from './HiddenCheckbox';

interface SectionFieldsProps {
	/** Prefix for element ids, e.g. 'note' → 'note-order', 'note-section'. */
	idPrefix: string;
	order: string;
	onOrderChange: (value: string) => void;
	onOrderBlur: () => void;
	section: string;
	onSectionChange: (value: string) => void;
	onSectionBlur: () => void;
	sectionError: boolean;
	sectionHelperText?: string;
	isHidden: boolean;
	onHiddenChange: (hidden: boolean) => void;
	hiddenStatus: HiddenStatus;
	onHiddenRetry: () => void;
}

/** The Order + Section + Hidden row shared by the Create and Edit note panels. */
function SectionFields({
	idPrefix,
	order,
	onOrderChange,
	onOrderBlur,
	section,
	onSectionChange,
	onSectionBlur,
	sectionError,
	sectionHelperText,
	isHidden,
	onHiddenChange,
	hiddenStatus,
	onHiddenRetry,
}: SectionFieldsProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				gap: 1.5,
				minWidth: 0,
				width: { xs: '100%', sm: '50%' },
				alignItems: { xs: 'stretch', sm: 'flex-start' },
			}}
		>
			<StandardTextField
				id={`${idPrefix}-order`}
				label='Order'
				value={order}
				onChange={(e) => onOrderChange(clampOrderInput(e.target.value))}
				onBlur={onOrderBlur}
				inputProps={{
					inputMode: 'numeric',
					pattern: '[0-9]*',
					maxLength: 3,
				}}
				sx={{
					flexShrink: 0,
					width: { xs: '100%', sm: '4.5rem' },
					minWidth: 0,
				}}
				size='small'
			/>
			<StandardTextField
				id={`${idPrefix}-section`}
				label='Section'
				value={section}
				onChange={(e) => onSectionChange(e.target.value)}
				onBlur={onSectionBlur}
				sx={{ flex: { sm: 1 }, minWidth: 0, width: '100%' }}
				size='small'
				required
				error={sectionError}
				helperText={sectionHelperText}
			/>
			<Box
				sx={{
					position: 'relative',
					flexShrink: 0,
					alignSelf: 'flex-start',
				}}
			>
				<HiddenCheckbox
					checked={isHidden}
					onChange={onHiddenChange}
					status={hiddenStatus}
					onRetry={onHiddenRetry}
				/>
			</Box>
		</Box>
	);
}

export { SectionFields };
