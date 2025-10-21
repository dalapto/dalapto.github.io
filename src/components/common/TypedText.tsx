import * as React from 'react';
import Typed from 'typed.js';

export interface TypedTextProps {
	string_list: string[];
}

function TypedText({ string_list = [] }: TypedTextProps) {
	const elAnchor = React.useRef(null);

	React.useEffect(() => {
		const typed = new Typed(elAnchor.current, {
			strings: string_list,
			typeSpeed: 80,
			backSpeed: 60,
			loop: true,
			backDelay: 2000,
			startDelay: 3000,
			smartBackspace: false,
		});

		return () => {
			typed.destroy();
		};
	}, []);

	return <span ref={elAnchor} />;
}
export default TypedText;
