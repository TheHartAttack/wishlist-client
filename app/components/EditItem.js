import React, { useEffect, useContext, useRef } from "react"
import { useImmer } from "use-immer"
import axios from "axios"
import { useMutation, useLazyQuery } from "@apollo/client"
import CurrencyInput from "react-currency-input-field"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faFileArrowUp, faLock, faLockOpen, faEdit, faTrashCan, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { GET_ITEMS, GET_SIGNATURE } from "../graphql/queries"
import { EDIT_ITEM } from "../graphql/mutations"

//Contexts
import StateContext from "../contexts/StateContext"
import DispatchContext from "../contexts/DispatchContext"

function EditItem() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const imageInput = useRef("")

	const [state, setState] = useImmer({
		id: appState.editItem.data.id,
		name: appState.editItem.data.name,
		price: appState.editItem.data.price / 100,
		notes: appState.editItem.data.notes,
		link: appState.editItem.data.link,
		private: appState.editItem.data.private,
		order: appState.editItem.data.order,
		image: "",
		preview: appState.editItem.data.image ? `https://res.cloudinary.com/dnctvkdic/image/upload/b_auto:border,c_pad,w_800,h_960,q_100/${appState.editItem.data.image}.jpg` : "",
		imageUpdated: false,
		submitCount: 0,
		submitting: false,
	})

	const [editItem] = useMutation(EDIT_ITEM)
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
					editItem({
						variables: {
							editItemId: appState.editItem.data.id,
							name: state.name,
							price: Number(state.price) * 100,
							notes: state.notes,
							link: state.link,
							private: state.private,
							imageUpdated: state.imageUpdated,
							image: image,
							token: appState.token,
						},
						refetchQueries: [{ query: GET_ITEMS, variables: { token: appState.token ?? "" } }],
					})
					setState(draft => {
						draft.submitting = false
					})
					appDispatch({ type: "flashMessage", value: `${state.name} has been edited!` })
					appDispatch({ type: "closeEditItem" })
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

	function handleImage(e) {
		if (e.target.files[0]) {
			setState(draft => {
				draft.imageUpdated = true
				draft.preview = URL.createObjectURL(e.target.files[0])
				draft.image = e.target.files[0]
			})
		}
	}

	function deleteImage(e) {
		setState(draft => {
			draft.imageUpdated = true
			draft.preview = null
			draft.image = ""
		})
	}

	function handleSubmit(e) {
		e.preventDefault()
		setState(draft => {
			draft.submitCount++
		})
	}

	return (
		<div className="edit-item modal">
			<a className="modal__close" href="#" onClick={() => appDispatch({ type: "closeEditItem" })}>
				<FontAwesomeIcon icon={faXmark} />
			</a>

			<div className="modal__inner">
				<form className="edit-item__form form" onSubmit={handleSubmit}>
					<div className="edit-item__col edit-item__col--image">
						<div className="edit-item__group form__group">
							<label className="edit-item__label form__label" htmlFor="edit-item__image">
								Image:
							</label>
							{state.preview ? (
								<label className="edit-item__image-button-label" htmlFor="edit-item__image-input">
									<img className="edit-item__image-preview" src={state.preview} alt=""></img>
									<FontAwesomeIcon icon={faTrashCan} />
									<input className="edit-item__image-delete button" id="edit-item__image-input" type="button" onClick={deleteImage}></input>
								</label>
							) : (
								<label className="edit-item__image-button-label" htmlFor="edit-item__image-input">
									<FontAwesomeIcon icon={faFileArrowUp} />
									<input className="edit-item__image-file" type="file" name="image" id="edit-item__image-input" ref={imageInput} onChange={handleImage} />
								</label>
							)}
						</div>
					</div>

					<div className="edit-item__col edit-item__col--text">
						<div className="edit-item__group form__group">
							<label className="edit-item__label form__label" htmlFor="edit-item__name">
								Name:
							</label>
							<input
								className="edit-item__input form__input"
								id="edit-item__name"
								type="text"
								autoFocus
								value={state.name}
								onChange={e =>
									setState(draft => {
										draft.name = e.target.value
									})
								}
							/>
						</div>

						<div className="edit-item__group form__group">
							<label className="edit-item__label form__label" htmlFor="edit-item__price">
								Price:
							</label>
							<CurrencyInput
								className="edit-item__input form__input"
								id="edit-item__price"
								placeholder=""
								prefix="£"
								maxLength="16"
								defaultValue={0}
								decimalScale={2}
								decimalsLimit={2}
								// fixedDecimalLength={2}
								value={state.price}
								onValueChange={(value, name, values) =>
									setState(draft => {
										draft.price = value
									})
								}
							/>
						</div>

						<div className="edit-item__group form__group">
							<label className="edit-item__label form__label" htmlFor="edit-item__link">
								Link:
							</label>
							<input
								className="edit-item__input form__input"
								id="edit-item__link"
								type="text"
								value={state.link}
								onChange={e =>
									setState(draft => {
										draft.link = e.target.value
									})
								}
							/>
						</div>

						<div className="edit-item__group form__group">
							<label className="edit-item__label form__label" htmlFor="edit-item__notes">
								Notes:
							</label>
							<textarea
								className="edit-item__input form__input"
								id="edit-item__notes"
								value={state.notes}
								onChange={e =>
									setState(draft => {
										draft.notes = e.target.value
									})
								}
							></textarea>
						</div>

						<div className="edit-item__group form__group">
							<label className="edit-item__label form__label" htmlFor="edit-item__private">
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
									id="edit-item__private"
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

					<button className={`edit-item__submit form__submit ${state.submitting ? "form__submit--submitting" : ""} button`} type="submit" disabled="">
						<div className="form__submit-inner ">
							<span>Edit Item</span>
							{state.submitting ? <FontAwesomeIcon icon={faSpinner} /> : <FontAwesomeIcon icon={faEdit} />}
						</div>
					</button>
				</form>
			</div>
		</div>
	)
}

export default EditItem
