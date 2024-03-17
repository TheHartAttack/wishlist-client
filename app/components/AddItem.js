import React, { useEffect, useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faFileArrowUp, faLock, faLockOpen, faPlus } from "@fortawesome/free-solid-svg-icons"

//Contexts
import DispatchContext from "../contexts/DispatchContext"

function AddItem() {
	const appDispatch = useContext(DispatchContext)

	function closeAddItem(e) {
		e.preventDefault()
		appDispatch({ type: "closeAddItem" })
	}

	return (
		<div className="add-item modal">
			<a className="modal__close" href="#" onClick={closeAddItem}>
				<FontAwesomeIcon icon={faXmark} />
			</a>

			<div className="modal__inner">
				<form className="add-item__form form">
					<div className="add-item__col add-item__col--image">
						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__image">
								Image:
							</label>
							<label className="add-item__image-button-label" htmlFor="add-item__image-input">
								<FontAwesomeIcon icon={faFileArrowUp} />
								<input className="add-item__image-file" type="file" name="image" id="add-item__image-input" />
							</label>
						</div>
					</div>

					<div className="add-item__col add-item__col--text">
						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__name">
								Name:
							</label>
							<input className="add-item__input form__input" id="add-item__name" type="text" value="" />
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__price">
								Price:
							</label>
							<input className="add-item__input form__input" id="add-item__price" placeholder="£0.00" type="text" value="" inputmode="numeric" />
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__link">
								Link:
							</label>
							<input className="add-item__input form__input" id="add-item__link" type="text" value="" />
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__notes">
								Notes:
							</label>
							<textarea className="add-item__input form__input" id="add-item__notes"></textarea>
						</div>

						<div className="add-item__group form__group">
							<label className="add-item__label form__label" htmlFor="add-item__notes">
								Private:
							</label>
							<button type="button" role="switch" aria-checked="false" className="rc-switch rc-switch">
								<span className="rc-switch-inner">
									<span className="rc-switch-inner-checked">
										<FontAwesomeIcon icon={faLock} />
									</span>
									<span className="rc-switch-inner-unchecked">
										<FontAwesomeIcon icon={faLockOpen} />
									</span>
								</span>
							</button>
						</div>
					</div>

					<button className="add-item__submit form__submit  button" type="submit" disabled="">
						<div className="form__submit-inner ">
							<span>Add Item</span>
							<FontAwesomeIcon icon={faPlus} />
						</div>
					</button>
				</form>
			</div>
		</div>
	)
}

export default AddItem
