import React, { useContext } from "react"
import { faPlus, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons"

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

	function openLogin(e) {
		e.preventDefault()
		appDispatch({ type: "openLogin" })
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
					<Button className="add-item-button" icon={faPlus} text="Add Item" onClick={e => openAddItem(e)} />
					{appState.loggedIn ? (
						<Button
							className="logout"
							icon={faRightFromBracket}
							text="Logout"
							onClick={e => {
								appDispatch({ type: "logout" })
							}}
						/>
					) : (
						<Button className="login" icon={faRightToBracket} text="Login" onClick={e => openLogin(e)} />
					)}
				</div>
			</div>
		</header>
	)
}

export default Header
