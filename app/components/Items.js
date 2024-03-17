import React, { useEffect, useContext } from "react"
import { useQuery } from "@apollo/client"
import { GET_ITEMS } from "../graphql/queries"

//Contexts
import StateContext from "../contexts/StateContext"

//Componenets
import Item from "./Item"

function Items() {
	const appState = useContext(StateContext)

	const { loading, error, data } = useQuery(GET_ITEMS, {
		variables: { token: appState.token ? appState.token : "" },
	})

	if (loading) {
		return (
			<div className="items">
				<p>Loading...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="items">
				<p>{error.message}</p>
			</div>
		)
	}

	return (
		<div className="items">
			{data.items.map(item => {
				return <Item key={item.id} item={item} />
			})}
		</div>
	)
}

export default Items
