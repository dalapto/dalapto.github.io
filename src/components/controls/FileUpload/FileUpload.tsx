import CloseIcon from '@mui/icons-material/Close';
import React, { useRef, useState } from 'react';
import './FileUpload.css';

type FilePreview = {
	name: string;
	kind: 'pdf' | 'text' | 'other';
	content: string;
};

const TEXT_TYPES = ['text/plain', 'application/json'];
const PDF_TYPE = 'application/pdf';

function getKind(file: File): FilePreview['kind'] {
	if (file.type === PDF_TYPE || file.name.endsWith('.pdf')) return 'pdf';
	if (
		TEXT_TYPES.includes(file.type) ||
		file.name.endsWith('.txt') ||
		file.name.endsWith('.json')
	)
		return 'text';
	return 'other';
}

function FileUpload() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previews, setPreviews] = useState<FilePreview[]>([]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		files.forEach((file) => {
			const kind = getKind(file);
			const reader = new FileReader();
			reader.onload = (ev) => {
				setPreviews((prev) => [
					...prev,
					{ name: file.name, kind, content: ev.target?.result as string },
				]);
			};
			if (kind === 'text') {
				reader.readAsText(file);
			} else {
				reader.readAsDataURL(file);
			}
		});
		e.target.value = '';
	};

	const removePreview = (index: number) => {
		setPreviews((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div>
			<input
				ref={fileInputRef}
				type='file'
				accept='.pdf,.doc,.docx,.txt,.json,application/pdf,text/plain,application/json'
				multiple
				hidden
				aria-hidden='true'
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
			<button onClick={() => fileInputRef.current?.click()}>
				Upload File(s)
			</button>
			{previews.length > 0 && (
				<div className='file-upload-previews'>
					{previews.map((preview, i) => (
						<div key={i} className='file-upload-item'>
							<div className='file-upload-item-header'>
								<span className='file-upload-item-name'>{preview.name}</span>
								<button
									className='file-upload-remove-btn'
									onClick={() => removePreview(i)}
									aria-label='Remove File'
								>
									<CloseIcon fontSize='small' />
								</button>
							</div>
							{preview.kind === 'pdf' && (
								<iframe
									src={preview.content}
									title={preview.name}
									className='file-upload-iframe'
									allowFullScreen={true}
								/>
							)}
							{preview.kind === 'text' && (
								<pre className='file-upload-text'>{preview.content}</pre>
							)}
							{preview.kind === 'other' && (
								<p className='file-upload-unsupported'>
									Preview not available for this file type.
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export { FileUpload };
