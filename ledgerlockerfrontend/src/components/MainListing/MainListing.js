import React from "react";
import "./MainListing.css"

export default function MainListing(props) {
	return (
		<div className="box" key={props.key}>
			<h1>{props.listing.name}</h1>
			<p>
				Address: <b>{props.listing.address}</b>
				Rent: <b>{props.listing.rent}</b>
				<img className="listing-img" src={props.listing.img}></img>
			</p>
		</div>
	);
}
