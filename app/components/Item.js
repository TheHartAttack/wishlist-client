import React, { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping, faEllipsis, faGripLines } from "@fortawesome/free-solid-svg-icons"

//Components
import Button from "./Button"

function Item({ item }) {
	return (
		<div className="item ">
			<img className="item__image" src={`https://res.cloudinary.com/dnctvkdic/image/upload/b_auto:border,c_pad,w_800,h_960,q_100/${item.image}.jpg`} alt="" />
			<h3 className="item__name">{item.name}</h3>
			<span className="item__price">{item.price}</span>
			<Button icon={faCartShopping} text="Buy" className="item__link" href={item.link} />

			<div className="item__menu">
				<a className="item__menu-toggle " href="#">
					<FontAwesomeIcon icon={faEllipsis} />
				</a>
				<div className="item__drag-handle">
					<FontAwesomeIcon icon={faGripLines} />
				</div>
			</div>
		</div>
	)
}

export default Item
