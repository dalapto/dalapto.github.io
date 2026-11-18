import { useEffect, useState } from 'react';
import { fetchWithTimeout } from '../../../utils/fetch-with-timeout';
import { logErrorDetails } from '../../../utils/getErrorMessage';

/** Every PDF starts with these bytes. */
const PDF_SIGNATURE = '%PDF-';

type PdfState =
	| { status: 'loading' }
	| { status: 'ready'; url: string }
	| { status: 'invalid' }
	| { status: 'error' };

function hasPdfSignature(bytes: ArrayBuffer): boolean {
	const head = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 1024));
	// Allow a little leading junk, as PDF readers do.
	return new TextDecoder('latin1').decode(head).includes(PDF_SIGNATURE);
}

interface PdfPreviewProps {
	/** data: URL (just picked) or storage URL (saved). */
	src: string;
	name: string;
	className?: string;
}

/**
 * Previews a PDF without trusting its name or stored content type: the bytes
 * are checked for the PDF signature, then shown from a blob forced to
 * `application/pdf`. A ".pdf" that is really HTML can therefore never render
 * as a web page inside the site.
 *
 * (A `sandbox` attribute would be the usual fix, but Chrome refuses to show
 * PDFs in sandboxed iframes.)
 */
function PdfPreview({ src, name, className }: PdfPreviewProps) {
	const [state, setState] = useState<PdfState>({ status: 'loading' });

	useEffect(() => {
		let cancelled = false;
		let objectUrl: string | null = null;
		setState({ status: 'loading' });

		void (async () => {
			try {
				const res = await fetchWithTimeout(src);
				if (!res.ok) throw new Error(`Failed to load PDF (${res.status})`);
				const bytes = await res.arrayBuffer();
				if (cancelled) return;

				if (!hasPdfSignature(bytes)) {
					setState({ status: 'invalid' });
					return;
				}
				objectUrl = URL.createObjectURL(
					new Blob([bytes], { type: 'application/pdf' }),
				);
				setState({ status: 'ready', url: objectUrl });
			} catch (error) {
				logErrorDetails(error, `Load PDF preview (${name})`);
				if (!cancelled) setState({ status: 'error' });
			}
		})();

		return () => {
			cancelled = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [src, name]);

	switch (state.status) {
		case 'ready':
			return (
				<iframe
					src={state.url}
					title={name}
					className={className}
					allowFullScreen={true}
				/>
			);
		case 'loading':
			return <p className='file-upload-unsupported'>Loading preview…</p>;
		case 'invalid':
			return (
				<p className='file-upload-unsupported'>
					This file isn&apos;t a valid PDF, so it can&apos;t be previewed.
				</p>
			);
		case 'error':
			return (
				<p className='file-upload-unsupported'>Couldn&apos;t load the preview.</p>
			);
	}
}

export { PdfPreview };
