import { gql } from "@apollo/client"

const GET_ITEMS = gql`
	query GetItems($token: String!) {
		items(token: $token) {
			id
			image
			name
			link
			price
			notes
			order
			private
		}
	}
`
export { GET_ITEMS }
