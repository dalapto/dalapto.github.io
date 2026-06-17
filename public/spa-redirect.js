(function () {
	function isSafePath(p) {
		return typeof p === 'string' && p.startsWith('/') && !p.startsWith('//');
	}

	// sessionStorage redirect (clean URL, no mutation)
	try {
		var redirect = sessionStorage.getItem('redirect');
		if (isSafePath(redirect)) {
			sessionStorage.removeItem('redirect');
			history.replaceState(null, null, redirect);
			return;
		}
	} catch (e) {
		console.warn('Failed to redirect from sessionStorage: ', e);
	}

	// Fallback: query string redirect (?/about/me)
	var q = window.location.search.slice(1);
	if (isSafePath(q)) {
		history.replaceState(null, null, q);
	}
})();
