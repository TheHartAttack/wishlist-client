import React, { useEffect, useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

//Contexts
import StateContext from "../contexts/StateContext"
import DispatchContext from "../contexts/DispatchContext"

function Image() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	function closeModal() {
		appDispatch({ type: "closeImageModal" })
	}

	return (
		<div className="image-modal modal modal-enter-done">
			<a className="modal__close" href="#" onClick={closeModal}>
				<FontAwesomeIcon icon={faXmark} />
			</a>
			<div className="modal__inner">
				<img className="image-modal__img" src={appState.imageModal.src} alt="" />
			</div>
		</div>
	)
}

export default Image
