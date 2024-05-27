import React, { useEffect, useContext, Suspense } from "react"
import { useImmer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import accounting from "accounting"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping, faEllipsis, faGripLines, faTrash, faEdit, faImage } from "@fortawesome/free-solid-svg-icons"
import { useMutation } from "@apollo/client"
import { GET_ITEMS } from "../graphql/queries"
import { DELETE_ITEM } from "../graphql/mutations"

//Contexts
import StateContext from "../contexts/StateContext"
import DispatchContext from "../contexts/DispatchContext"

//Components
import Button from "./Button"

function Item({ item, provided }) {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const [state, setState] = useImmer({
		menuOpen: false,
		deleting: false,
		deleteCount: 0,
	})

	const [actuallyDeleteItem] = useMutation(DELETE_ITEM, {
		variables: {
			token: appState.token ? appState.token : "",
			deleteItemId: item.id,
		},
		refetchQueries: [{ query: GET_ITEMS, variables: { token: appState.token } }],
	})

	useEffect(() => {
		if (state.deleteCount) {
			async function deleteItem() {
				try {
					setState(draft => {
						draft.deleting = true
					})

					const response = await actuallyDeleteItem()

					if (!response.data.deleteItem.errors.length) {
						appDispatch({ type: "flashMessage", value: `${response.data.deleteItem.item.name} has been deleted!` })
						setState(draft => {
							draft.deleting = false
						})
					} else {
						throw new Error(response.data.deleteItem.errors[0])
					}
				} catch (error) {
					console.log(error.message)
					appDispatch({ type: "flashMessage", value: error.message, warning: true })
					setState(draft => {
						draft.deleting = false
					})
				}
			}
			deleteItem()
		}

		return
	}, [state.deleteCount])

	function openModal(e) {
		appDispatch({ type: "openImageModal", data: e.target.src })
	}

	function toggleMenu() {
		setState(draft => {
			draft.menuOpen = !draft.menuOpen
		})
	}

	function closeMenu() {
		setState(draft => {
			draft.menuOpen = false
		})
	}

	function increaseDeleteCount() {
		if (!state.deleting) {
			setState(draft => {
				draft.deleteCount++
			})
		}
	}

	return (
		<div className="item " onMouseLeave={closeMenu} {...provided.draggableProps} ref={provided.innerRef}>
			{item.image && <img className="item__image" src={`https://res.cloudinary.com/dnctvkdic/image/upload/b_auto:border,c_pad,w_800,h_960,q_100/${item.image}.jpg`} alt="" onClick={e => openModal(e)} />}

			{!item.image && (
				<div className="item__no-image">
					<FontAwesomeIcon icon={faImage} />
				</div>
			)}

			{item.name && <h3 className="item__name">{item.name}</h3>}

			{item.price > 0 && <span className="item__price">{accounting.formatMoney(item.price / 100, "£")}</span>}

			{item.link && <Button icon={faCartShopping} text="Buy" className="item__link" href={item.link} />}

			{item.notes && <div className="item__notes">{item.notes}</div>}

			<div className="item__menu">
				<CSSTransition timeout={250} in={state.menuOpen} classNames="item__menu-options" unmountOnExit>
					<Suspense>
						<div className="item__menu-options">
							<a className={`item__menu-option ${state.deleting ? "item__menu-option--deleting" : ""}`} href="#" onClick={increaseDeleteCount}>
								<div className="item__menu-option-inner ">
									<span>Delete</span> <FontAwesomeIcon icon={faTrash} />
								</div>
							</a>
							<a className="item__menu-option" href="#" onClick={() => appDispatch({ type: "openEditItem", data: item })}>
								<div className="item__menu-option-inner">
									<span>Edit</span> <FontAwesomeIcon icon={faEdit} />
								</div>
							</a>
						</div>
					</Suspense>
				</CSSTransition>
				<a className={`item__menu-toggle ${state.menuOpen ? "item__menu-toggle--active" : ""}`} href="#" onClick={e => toggleMenu()}>
					<FontAwesomeIcon icon={faEllipsis} />
				</a>
				<div className="item__drag-handle" {...provided.dragHandleProps}>
					<FontAwesomeIcon icon={faGripLines} />
				</div>
			</div>
		</div>
	)
}

export default Item
