import React from "react";

export default function MainListing(props) {
	return (
		<div key={props.key}>
			<h1>{props.listing.name}</h1>;
			<p>
				Address: <b>{props.listing.address}</b>
				Rent: <b>{props.listing.rent}</b>
				<img src={props.listing.img}></img>
			</p>
		</div>
	);
}
