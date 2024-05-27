import React, { useEffect, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { CSSTransition } from "react-transition-group"
import { useImmerReducer } from "use-immer"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import _ from "lodash"

const client = new ApolloClient({
	uri: process.env.NODE_ENV == "production" ? process.env.PRODUCTION_URI : "http://localhost:8000",
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
import Login from "./components/Login"
import Image from "./components/Image"
import EditItem from "./components/EditItem"

function Main() {
	const initialState = {
		siteName: "Dans Wishlist",
		loggedIn: Boolean(localStorage.getItem("danWishlistToken")),
		token: localStorage.getItem("danWishlistToken") ?? localStorage.getItem("danWishlistToken"),
		items: [],
		flashMessages: [],
		addItemOpen: false,
		loginOpen: false,
		editItem: {
			open: false,
			data: {},
		},
		imageModal: {
			open: false,
			src: "",
		},
		updateOrderCount: 0,
	}

	const [state, dispatch] = useImmerReducer(Reducer, initialState)

	useEffect(() => {
		window.addEventListener("keyup", e => keypressHandler(e))
	}, [])

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem("danWishlistToken", state.token)
		} else {
			localStorage.removeItem("danWishlistToken")
		}
	}, [state.loggedIn])

	function keypressHandler(e) {
		if (e.keyCode == 27) {
			dispatch({ type: "closeLogin" })
			dispatch({ type: "closeAddItem" })
			dispatch({ type: "closeEditItem" })
			dispatch({ type: "closeImageModal" })
		}
	}

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
					<CSSTransition timeout={250} in={state.loginOpen} classNames="modal" unmountOnExit>
						<Suspense>
							<Login />
						</Suspense>
					</CSSTransition>
					<CSSTransition timeout={250} in={state.imageModal.open} classNames="modal" unmountOnExit>
						<Suspense>
							<Image />
						</Suspense>
					</CSSTransition>
					<CSSTransition timeout={250} in={state.editItem.open} classNames="modal" unmountOnExit>
						<Suspense>
							<EditItem />
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
