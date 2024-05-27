import React, { useEffect, useContext, useRef } from "react"
import { useImmer } from "use-immer"
import { useMutation, useLazyQuery } from "@apollo/client"
import axios from "axios"
import CurrencyInput from "react-currency-input-field"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faFileArrowUp, faLock, faLockOpen, faPlus, faTrashCan, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { GET_ITEMS, GET_SIGNATURE } from "../graphql/queries"
import { ADD_ITEM } from "../graphql/mutations"

//Contexts
import StateContext from "../contexts/StateContext"
import DispatchContext from "../contexts/DispatchContext"

function AddItem() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const imageInput = useRef("")

	const [state, setState] = useImmer({
		name: "",
		price: 0,
		link: "",
		notes: "",
		private: false,
		image: null,
		preview: null,
		submitting: false,
		submitCount: 0,
	})

	const [addItem] = useMutation(ADD_ITEM, { refetchQueries: [{ query: GET_ITEMS, variables: { token: appState.token ?? "" } }] })
	const [getSignature] = useLazyQuery(GET_SIGNATURE)

	useEffect(() => {
		if (state.submitCount) {
			setState(draft => {
				draft.submitting = true
			})
			async function submitItem() {
				//Upload Image
				let image = {
					public_id: null,
					version: null,
					signature: null,
				}

				if (state.image) {
					const signatureResponse = await getSignature()

					const data = new FormData()
					data.append("file", state.image)
					data.append("api_key", 817411213165764)
					data.append("signature", signatureResponse.data.signature.signature)
					data.append("timestamp", signatureResponse.data.signature.timestamp)

					const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/dnctvkdic/image/upload`, data, {
						headers: { "Content-Type": "multipart/form-data" },
					})

					image = {
						public_id: cloudinaryResponse.data.public_id,
						version: cloudinaryResponse.data.version,
						signature: cloudinaryResponse.data.signature,
					}
				}

				//Validation
				const errors = []

				if (!state.name) {
					errors.push("You must provide a name.")
				}

				if (!errors.length) {
					addItem({
						variables: {
							image: image,
							name: state.name,
							price: Number(state.price) * 100,
							notes: state.notes,
							link: state.link,
							private: state.private,
							token: appState.token,
						},
						refetchQueries: [{ query: GET_ITEMS, variables: { token: appState.token ?? "" } }],
						awaitRefetchQueries: true,
						onCompleted: data => console.log(data),
					})
					setState(draft => {
						draft.submitting = false
					})
					appDispatch({ type: "flashMessage", value: `${state.name} has been added!` })
					appDispatch({ type: "closeAddItem" })
				} else {
					setState(draft => {
						draft.submitting = false
					})
					appDispatch({ type: "flashMessage", value: errors[0], warning: true })
				}
			}
			submitItem()
		}
	}, [state.submitCount])

	function closeAddItem(e) {
		e.preventDefault()
		appDispatch({ type: "closeAddItem" })
	}

	function handleImage(e) {
		if (e.target.files[0]) {
			setState(draft => {
				draft.preview = URL.createObjectURL(e.target.files[0])
				draft.image = e.target.files[0]
			})
		}
	}

	async function deleteImage(e) {
		setState(draft => {
			draft.preview = ""
			draft.image = null
		})
	}

	function handleSubmit(e) {
		e.preventDefault()
		setState(draft => {
			draft.submitCount++
		})
	}

	return (
		<div className="add-item modal">
			<a className="modal__close" href="#" onClick={closeAddItem}>
				<FontAwesomeIcon icon={faXmark} />
			</a>

			<div className="modal__inner">
				<form className="add-item__form form" onSubmit={handleSubmit}>
					<div className="add-item__col add-item__col--image">
						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__image">
								Image:
							</label>
							{state.preview ? (
								<label className="add-item__image-button-label" htmlFor="add-item__image-input">
									<img className="add-item__image-preview" src={state.preview} alt=""></img>
									<FontAwesomeIcon icon={faTrashCan} />
									<input className="add-item__image-delete button" id="add-item__image-input" type="button" onClick={deleteImage}></input>
								</label>
							) : (
								<label className="add-item__image-button-label" htmlFor="add-item__image-input">
									<FontAwesomeIcon icon={faFileArrowUp} />
									<input className="add-item__image-file" type="file" name="image" id="add-item__image-input" ref={imageInput} onChange={handleImage} />
								</label>
							)}
						</div>
					</div>

					<div className="add-item__col add-item__col--text">
						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__name">
								Name:
							</label>
							<input
								className="add-item__input form__input"
								id="add-item__name"
								type="text"
								autoFocus
								value={state.name}
								onChange={e => {
									setState(draft => {
										draft.name = e.target.value
									})
								}}
							/>
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__price">
								Price:
							</label>
							<CurrencyInput
								className="add-item__input form__input"
								id="add-item__price"
								placeholder=""
								prefix="£"
								defaultValue={0}
								decimalScale={2}
								decimalsLimit={2}
								// fixedDecimalLength={2}
								value={state.price}
								onValueChange={(value, name, values) => {
									setState(draft => {
										draft.price = value
									})
								}}
							/>
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__link">
								Link:
							</label>
							<input
								className="add-item__input form__input"
								id="add-item__link"
								type="text"
								value={state.link}
								onChange={e =>
									setState(draft => {
										draft.link = e.target.value
									})
								}
							/>
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__notes">
								Notes:
							</label>
							<textarea
								className="add-item__input form__input"
								id="add-item__notes"
								value={state.notes}
								onChange={e => {
									setState(draft => {
										draft.notes = e.target.value
									})
								}}
							></textarea>
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__private">
								Private:
							</label>
							<label className="form__switch">
								<div className="form__switch-inner">
									<FontAwesomeIcon icon={faLock} />
									<span></span>
									<FontAwesomeIcon icon={faLockOpen} />
								</div>
								<input
									type="checkbox"
									id="add-item__private"
									checked={state.private}
									onChange={e =>
										setState(draft => {
											draft.private = e.target.checked
										})
									}
								/>
							</label>
						</div>
					</div>

					<button className={`add-item__submit form__submit ${state.submitting ? "form__submit--submitting" : ""} button`} type="submit" disabled="">
						<div className="form__submit-inner ">
							<span>Add Item</span>
							{state.submitting ? <FontAwesomeIcon icon={faSpinner} /> : <FontAwesomeIcon icon={faPlus} />}
						</div>
					</button>
				</form>
			</div>
		</div>
	)
}

export default AddItem
