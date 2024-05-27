import { gql } from "@apollo/client"

const ADD_ITEM = gql`
	mutation AddItem($name: String!, $token: String!, $price: Int, $link: String, $notes: String, $image: ImageDataInput, $private: Boolean) {
		addItem(name: $name, token: $token, price: $price, link: $link, notes: $notes, image: $image, private: $private) {
			item {
				id
				name
				price
				notes
				link
				image
				private
				order
			}
			errors
		}
	}
`

const EDIT_ITEM = gql`
	mutation EditItem($editItemId: ID!, $name: String!, $token: String!, $price: Int, $link: String, $notes: String, $image: ImageDataInput, $imageUpdated: Boolean, $private: Boolean) {
		editItem(id: $editItemId, name: $name, token: $token, price: $price, link: $link, notes: $notes, image: $image, imageUpdated: $imageUpdated, private: $private) {
			errors
			item {
				id
				name
				price
				notes
				link
				image
				private
				order
			}
		}
	}
`

const LOGIN_USER = gql`
	mutation LoginUser($username: String!, $password: String!) {
		loginUser(username: $username, password: $password) {
			errors
			token
		}
	}
`

const DELETE_ITEM = gql`
	mutation Mutation($deleteItemId: ID!, $token: String!) {
		deleteItem(id: $deleteItemId, token: $token) {
			errors
			item {
				name
			}
		}
	}
`

const UPDATE_ORDER = gql`
	mutation UpdateOrder($token: String!, $items: [ID]) {
		updateOrder(token: $token, items: $items) {
			success
		}
	}
`

export { ADD_ITEM, LOGIN_USER, DELETE_ITEM, EDIT_ITEM, UPDATE_ORDER }
