import React, { useEffect, useContext, useRef } from "react"
import { useImmer } from "use-immer"
import { useMutation } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faXmark, faRightToBracket, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { LOGIN_USER } from "../graphql/mutations"

//Contexts
import StateContext from "../contexts/StateContext"
import DispatchContext from "../contexts/DispatchContext"

function Login() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const usernameInput = useRef("")

	const [state, setState] = useImmer({
		username: "",
		password: "",
		submitting: false,
		submitCount: 0,
	})

	const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER)

	useEffect(() => {
		if (state.submitCount) {
			async function actuallySubmitForm() {
				try {
					setState(draft => {
						draft.submitting = true
					})

					const response = await loginUser({
						variables: {
							username: state.username,
							password: state.password,
						},
					})

					if (!response.data.loginUser.errors.length) {
						setState(draft => {
							draft.submitting = false
						})
						appDispatch({ type: "login", data: response.data.loginUser.token })
						appDispatch({ type: "flashMessage", value: "Logged in!" })
						appDispatch({ type: "closeLogin" })
					} else {
						throw new Error(response.data.loginUser.errors[0])
					}
				} catch (error) {
					console.log(error.message)
					setState(draft => {
						draft.submitting = false
						draft.username = ""
						draft.password = ""
					})
					usernameInput.current.focus()
					appDispatch({ type: "flashMessage", value: error.message, warning: true })
				}
			}
			actuallySubmitForm()
		}
	}, [state.submitCount])

	function submitForm(e) {
		e.preventDefault()
		setState(draft => {
			draft.submitCount++
		})
	}

	return (
		<div className="login modal">
			<a className="modal__close" href="#" onClick={() => appDispatch({ type: "closeLogin" })}>
				<FontAwesomeIcon icon={faXmark} />
			</a>

			<div className="modal__inner">
				<form className="login__form form" onSubmit={e => submitForm(e)}>
					<div className="login__group form__group">
						<label className="login__label form__label" htmlFor="login__username">
							Username:
						</label>
						<input
							className="login__input form__input"
							id="login__username"
							type="text"
							autoFocus
							ref={usernameInput}
							value={state.username}
							onChange={e => {
								setState(draft => {
									draft.username = e.target.value
								})
							}}
						/>
					</div>

					<div className="login__group form__group">
						<label className="login__label form__label" htmlFor="login__password">
							Password:
						</label>
						<input
							className="login__input form__input"
							id="login__password"
							type="password"
							value={state.password}
							onChange={e => {
								setState(draft => {
									draft.password = e.target.value
								})
							}}
						/>
					</div>

					<button className={`login__submit form__submit ${state.submitting ? "form__submit--submitting" : ""} button`} type="submit" disabled={state.submitting}>
						<div className="form__submit-inner ">
							{state.submitting ? (
								<>
									<span>Loading...</span> <FontAwesomeIcon icon={faSpinner} />
								</>
							) : (
								<>
									<span>Login</span> <FontAwesomeIcon icon={faRightToBracket} />
								</>
							)}
						</div>
					</button>
				</form>
			</div>
		</div>
	)
}

export default Login
