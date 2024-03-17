function mainReducer(draft, action) {
	switch (action.type) {
		case "login":
			draft.loggedIn = true
			draft.token = action.data
			return
		case "logout":
			draft.loggedIn = false
			return
		case "flashMessage":
			draft.flashMessages.push({ value: action.value, warning: action.warning })
			return
		case "openAddItem":
			draft.addItemOpen = true
			return
		case "closeAddItem":
			draft.addItemOpen = false
			return
	}
}

export default mainReducer
