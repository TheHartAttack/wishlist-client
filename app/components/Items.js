import React, { useEffect, useContext } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { GET_ITEMS } from "../graphql/queries"
import { UPDATE_ORDER } from "../graphql/mutations"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

//Contexts
import StateContext from "../contexts/StateContext"
import DispatchContext from "../contexts/DispatchContext"

//Componenets
import Item from "./Item"

function Items() {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	const { data, loading } = useQuery(GET_ITEMS, { variables: { token: appState.token ?? "" } })

	const [updateOrder] = useMutation(UPDATE_ORDER, { refetchQueries: [{ query: GET_ITEMS, variables: { token: appState.token ?? "" } }] })

	useEffect(() => {
		if (data) {
			appDispatch({ type: "setItems", data: data.items })
		}
	}, [data])

	useEffect(() => {
		if (appState.updateOrderCount) {
			updateOrder({
				variables: {
					items: appState.items.map(item => item.id),
					token: appState.token,
				},
				refetchQueries: [{ query: GET_ITEMS, variables: { token: appState.token ?? "" } }],
				onCompleted: data => {
					appDispatch({ type: "flashMessage", value: "Order updated!" })
				},
			})
		}
	}, [appState.updateOrderCount])

	function handleOnDragEnd(result) {
		if (!result.destination) {
			return
		}
		appDispatch({ type: "reorderItems", sourceIndex: result.source.index, destIndex: result.destination.index })
	}

	if (loading) {
		return (
			<div className="loading loading--items">
				<FontAwesomeIcon icon={faSpinner} />
			</div>
		)
	}

	if (!appState.items.length) {
		return (
			<div className="items">
				<p className="items__none">No items to display.</p>
			</div>
		)
	}

	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId="items">
				{provided => (
					<div className="items" {...provided.droppableProps} ref={provided.innerRef}>
						{appState.items.map((item, index) => {
							if (appState.loggedIn || !item.private) {
								return (
									<Draggable key={item.id} draggableId={item.id} index={index}>
										{provided => <Item key={item.id} item={item} provided={provided} />}
									</Draggable>
								)
							}
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}

export default Items
