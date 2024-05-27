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

const GET_SIGNATURE = gql`
	query Signature {
		signature {
			signature
			timestamp
		}
	}
`

export { GET_ITEMS, GET_SIGNATURE }
