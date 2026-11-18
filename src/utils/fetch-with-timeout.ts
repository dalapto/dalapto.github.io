const DEFAULT_FETCH_TIMEOUT_MS = 15_000;

/**
 * `fetch` that gives up after `timeoutMs` (rejects with a `TimeoutError`)
 * instead of hanging forever on a stalled connection. A caller-supplied
 * `signal` takes precedence.
 */
function fetchWithTimeout(
	input: RequestInfo | URL,
	init: RequestInit = {},
	timeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
): Promise<Response> {
	return fetch(input, {
		...init,
		signal: init.signal ?? AbortSignal.timeout(timeoutMs),
	});
}

export { DEFAULT_FETCH_TIMEOUT_MS, fetchWithTimeout };
