import { RefObject, useEffect } from 'react';

export function useButtonPress(
	buttonRef: RefObject<HTMLButtonElement | HTMLAnchorElement>,
	onClick: () => void,
) {
	useEffect(() => {
		const handleButtonClick = () => {
			onClick();
		};

		if (buttonRef.current) {
			buttonRef.current.addEventListener('click', handleButtonClick);
		}

		return () => {
			if (buttonRef.current) {
				buttonRef.current.removeEventListener('click', handleButtonClick);
			}
		};
	}, [buttonRef, onClick]);
}
