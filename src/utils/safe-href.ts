/** Link schemes allowed for external links. Everything else (javascript:, data:, vbscript:, …) is refused. */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

type SafeHref =
	| { kind: 'internal'; href: string }
	| { kind: 'external'; href: string };

/**
 * Validates a link that came from content (e.g. gist text). Returns `null`
 * when it must not be rendered as a link.
 *
 * Parsed with `new URL()` so the check matches how the browser reads it —
 * `JaVaScRiPt:`, leading spaces and embedded tabs/newlines are all normalised
 * before the scheme is compared.
 */
function toSafeHref(raw: string | undefined): SafeHref | null {
	const href = raw?.trim();
	if (!href) return null;

	// Same-site path ("//host" is protocol-relative, i.e. external).
	if (href.startsWith('/') && !href.startsWith('//')) {
		return { kind: 'internal', href };
	}

	try {
		const url = new URL(href, window.location.origin);
		if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
		return { kind: 'external', href: url.href };
	} catch {
		return null;
	}
}

export { toSafeHref, type SafeHref };
