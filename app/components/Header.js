import React, { useContext } from "react"
import { faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"

//Contexts
import StateContext from "../contexts/StateContext"
import DispatchContext from "../contexts/DispatchContext"

//Components
import Button from "./Button"

function Header() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	function openAddItem(e) {
		e.preventDefault()
		appDispatch({ type: "openAddItem" })
	}

	return (
		<header className="header">
			<div className="header__container">
				<div className="logo">
					<h1 className="logo__dw">{appState.siteName}</h1>
					<h1 className="logo__outline">{appState.siteName}</h1>
					<h1 className="logo__glow">{appState.siteName}</h1>
				</div>
				<div className="header__buttons">
					<Button className="add-item-button" icon={faPlus} text="Add Item" onClick={openAddItem} />
					<Button className="logout" icon={faRightFromBracket} text="Logout" />
				</div>
			</div>
		</header>
	)
}

export default Header
