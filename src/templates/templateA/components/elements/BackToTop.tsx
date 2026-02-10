'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			setIsVisible(scrollTop > 100);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = (e: React.MouseEvent) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<button
			type="button"
			className={`back-to-top heading ${isVisible ? "opacity-1" : "opacity-0"}`}
			onClick={scrollToTop}
			style={{ display: isVisible ? "block" : "none" }}
		>
			<i className="icon-left-open-big" />
			<span className="d-lg-inline d-md-none">Top</span>
		</button>
	);
}
