import React, { useState } from "react";
import Slider from "react-slick";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function BookingListing(props) {
	const [isModalVisible, setModalVisible] = useState(false);

	var settings = {
		dots: true,
		infinite: true,
		slidesToScroll: 1,
		slidesToShow: 1
	};

	function handleLock() {
		axios
			.post("http://localhost:3001/api/lock/", {})
			.then(response => console.log(response))
			.catch(err => console.log(err));
	}

	function handleUnlock() {
		axios
			.post("http://localhost:3001/api/unlock/", {})
			.then(response => console.log(response))
			.catch(err => console.log(err));
  }

  function handleCheckout() {
    axios
      .post("http://localhost:3001/api/checkout/", { id: props.listing.id })
      .then(response => console.log(response))
      .catch(err => console.log(err));
  }

	return (
		<div>
			{/* Listing */}
			<div
				className="box"
			>
				<h1 className="title">{props.listing.name}</h1>
				<h2 className="subtitle">
					{props.listing.address} - {props.listing.rent}
				</h2>
				<button class="button is-primary" onClick={() => handleLock()}>Lock</button>
				{"  "}
				<button class="button is-link" onClick={() => handleUnlock()}>Unlock</button>
				{"  "}
				<button class="button is-success" onClick={() => handleCheckout()}>Check Out</button>
				<br />
				<img src={props.listing.images[0]} onClick={() => setModalVisible(!isModalVisible)}></img>
			</div>

			{/* Modal */}
			<div className={`modal ${isModalVisible ? "is-active" : ""}`}>
				<div className="modal-background"></div>
				<div className="modal-content">
					<section className="section is-clipped box">
						<h1 className="is-size-1">{props.listing.name}</h1>
						<br />
						<Slider {...settings}>
							{props.listing.images.map((img, i) => (
								<div key={i}>
									<img src={img} className="is-4by3" />
								</div>
							))}
						</Slider>
						<br />
						<br />
						<p className="is-size-5">{props.listing.description}</p>
						<br />
						<br />
						<p className="is-size-3">Policies</p>
						<ul className="is-size-5">
							<li>- Roomates are an additional $25/week</li>
							<li>- "Quiet Time" between 8pm to 9am</li>
							<li>- No Smoking</li>
							<li>- No Overnight Guests</li>
							<li>- No Pets</li>
						</ul>
						<br />
						<br />
						<p className="is-size-3">Rent</p>
						<p className="is-size-5">
							Daily Rent: {props.listing.rent}
							<br />
							Stake Amount: {props.listing.stake + "x"}
							<br />
						</p>
					</section>
				</div>
				<button
					className="modal-close is-large"
					aria-label="close"
					onClick={() => setModalVisible(!isModalVisible)}
				></button>
			</div>
		</div>
	);
}
