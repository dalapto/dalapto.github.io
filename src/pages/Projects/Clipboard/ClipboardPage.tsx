import React from 'react';
import { FileUpload } from '../../../components/controls/FileUpload/FileUpload';
import { ImageUpload } from '../../../components/controls/ImageUpload/ImageUpload';
import type { JsonTabsPanelData } from '../../../components/Json/JsonSection/JsonPanel';
import { JsonSection } from '../../../components/Json/JsonSection/JsonSection';
import { ImgPaths } from '../../../constants/img-paths';
import type { JsonTab } from '../../../types/basic.types';

const lastChanged = 'never';

const textControls = (
	<>
		<p>
			<label htmlFor='textpaste'>
				<strong>Last Edit: </strong>
				{lastChanged}
			</label>
		</p>
		<textarea
			rows={20}
			cols={80}
			id='textpaste'
			name='textpaste'
			placeholder='Paste text in here...'
		/>
	</>
	// if pasting image, renders in base 64
);

const fileControls = (
	<>
		<p>
			<strong>Last Edit: </strong>
			{lastChanged}
		</p>
		<FileUpload />
	</>
);

const imageControls = (
	<>
		<p>
			<strong>Last Edit: </strong>
			{lastChanged}
		</p>
		<ImageUpload />
	</>
);

const tabs: JsonTab[] = [
	{ id: 'image', label: 'Image', content: imageControls },
	{ id: 'text', label: 'Text', content: textControls },
	{ id: 'file', label: 'File', content: fileControls },
];

const tabsPanel: JsonTabsPanelData = {
	kind: 'tabs',
	tabs,
	ariaLabel: 'Clipboard tabs',
};

function Clipboard() {
	return (
		<JsonSection
			items={[tabsPanel]}
			gap='8rem'
			background={{
				image: {
					src: ImgPaths.pages.clipboard.windowapple,
					alt: 'A green apple with a bite taken out of it, sitting next to a tiny window.',
				},
				imagePosition: '-10% 50%',
			}}
		/>
	);
}

export { Clipboard };
