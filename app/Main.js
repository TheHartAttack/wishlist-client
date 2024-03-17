import React, { useEffect, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { CSSTransition } from "react-transition-group"
import { useImmerReducer } from "use-immer"
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client"
import _ from "lodash"

const client = new ApolloClient({
	uri: "http://localhost:8000",
	cache: new InMemoryCache(),
})

//Stylesheet
import "./assets/styles/styles.sass"

//Contexts & Reducer
import StateContext from "./contexts/StateContext"
import DispatchContext from "./contexts/DispatchContext"
import Reducer from "./reducers/Reducer"

//Components
import Header from "./components/Header"
import Items from "./components/Items"
import FlashMessages from "./components/FlashMessages"
import AddItem from "./components/AddItem"

function Main() {
	const initialState = {
		siteName: "Dans Wishlist",
		loggedIn: Boolean(localStorage.getItem("danWishlistToken")),
		flashMessages: [],
		token: localStorage.getItem("danWishlistToken"),
		size: "small",
		addItemOpen: false,
	}

	const [state, dispatch] = useImmerReducer(Reducer, initialState)

	useEffect(() => {
		window.addEventListener("resize", _.debounce(setWidth, 100))
		setWidth()

		return () => window.removeEventListener("resize", setWidth)
	}, [])

	function setWidth() {
		const w = window.innerWidth
		if (w < 360) {
			dispatch({ type: "setSize", value: "tiny" })
		} else if (w >= 360 && w < 720) {
			dispatch({ type: "setSize", value: "small" })
		} else if (w >= 720 && w < 1080) {
			dispatch({ type: "setSize", value: "medium" })
		} else if (w >= 1080 && w < 1440) {
			dispatch({ type: "setSize", value: "large" })
		} else if (w >= 1440) {
			dispatch({ type: "setSize", value: "huge" })
		}
	}

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem("danWishlistToken", state.user.token)
		} else {
			localStorage.removeItem("danWishlistToken")
		}
	}, [state.loggedIn])

	//Check if token has expired on first render
	// useEffect(() => {
	// 	if (state.loggedIn) {
	// 		const ourRequest = Axios.CancelToken.source()
	// 		async function fetchResults() {
	// 			try {
	// 				const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })

	// 				if (!response.data) {
	// 					dispatch({ type: "logout" })
	// 					dispatch({ type: "flashMessage", value: "Your session has expired - please log in again." })
	// 				}
	// 			} catch (e) {
	// 				console.log(e)
	// 			}
	// 		}
	// 		fetchResults()
	// 		return () => ourRequest.cancel()
	// 	}
	// }, [])

	return (
		<ApolloProvider client={client}>
			<StateContext.Provider value={state}>
				<DispatchContext.Provider value={dispatch}>
					<Header />
					<Items />
					<FlashMessages />
					<CSSTransition timeout={250} in={state.addItemOpen} classNames="modal" unmountOnExit>
						<Suspense>
							<AddItem />
						</Suspense>
					</CSSTransition>
				</DispatchContext.Provider>
			</StateContext.Provider>
		</ApolloProvider>
	)
}

const root = createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
	module.hot.accept()
}
