function mainReducer(draft, action) {
	switch (action.type) {
		case "setItems":
			draft.items = action.data
			draft.loading = false
			return
		case "openLogin":
			draft.loginOpen = true
			return
		case "closeLogin":
			draft.loginOpen = false
			return
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
		case "openImageModal":
			draft.imageModal.open = true
			draft.imageModal.src = action.data
			return
		case "closeImageModal":
			draft.imageModal.open = false
			draft.imageModal.src = ""
			return
		case "openEditItem":
			draft.editItem.open = true
			draft.editItem.data = action.data
			return
		case "closeEditItem":
			draft.editItem.open = false
			draft.editItem.data = {}
			return
		case "reorderItems":
			const [item] = draft.items.splice(action.sourceIndex, 1)
			draft.items.splice(action.destIndex, 0, item)
			draft.updateOrderCount++
			return
	}
}

export default mainReducer
