import React, { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Button({ className, text, icon, href, onClick }) {
	if (href) {
		return (
			<a className={`${className} button`} href={href} target="_blank" onClick={onClick}>
				<span>{text}</span>
				<FontAwesomeIcon icon={icon} />
			</a>
		)
	}

	return (
		<button className={`${className} button`} onClick={onClick}>
			<span>{text}</span>
			<FontAwesomeIcon icon={icon} />
		</button>
	)
}

export default Button
