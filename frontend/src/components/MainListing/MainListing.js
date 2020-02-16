import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import axios from "axios";
import Box from "3box";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9", "kovan");
let web3 = new Web3(fm.getProvider());

let box, space;
let spaceName = "ledgerlocker-test1";

export default function MainListing(props) {
	const [isModalVisible, setModalVisible] = useState(false);
	const [duration, setDuration] = useState(86400);
	const [addr, setAddr] = useState("");

	useEffect(() => {
		const loginUser = async () => {
			web3.eth.getAccounts().then(async address => {
				setAddr(address[0]);
				// addr = address[0]
				console.log("Address: ", address[0]);
				await open3Box(address[0]);
				web3.eth.defaultAccount = `${address[0]}`;
			});
		};

		loginUser();
	}, []);

	var settings = {
		dots: true,
		infinite: true,
		slidesToScroll: 1,
		slidesToShow: 1
	};

	function handleBooking() {
		console.log(
			`Sending from ${props.addr} to ${props.contract._address} with dai ${props.daiContract._address}`
		);
		props.daiContract.methods
			.approve(props.contract._address, "-1")
			.send({ from: props.addr })
			.then(
				props.contract.methods
					.bookListing(props.listing.id, duration)
					.send({ from: props.addr, gas: 500000 })
			)
			.then(
				// alert(
				//   `Booked listing with id: ${props.listing.id} and duration ${duration}`
				// )
				console.log("trolling right?")
			)
			.then(set3BoxData("lockCode", "9786"))
			.then(
				axios.post("http://localhost:3001/api/book", {
					id: props.listing.id,
					renter: props.addr
				})
			).then(console.log("donezo"));
	}

	const handleDurationChange = e => {
		setDuration(parseInt(e.currentTarget.value, 10) * 60 * 60 * 24);
	};

  return (
    <div>
      {/* Listing */}
      <div className="box" onClick={() => setModalVisible(!isModalVisible)}>
        <h1 className="title">{props.listing.name}</h1>
        <h2 className="subtitle">
          {props.listing.address} - {props.listing.price} DAI/day
        </h2>
        <img src={props.listing.images[0]}></img>
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
              Daily Rent: {props.listing.price}
              <br />
              Stake Amount: {props.listing.stake + "x"}
              <br />
              From: <input type="date" id="from-input" />
              <br />
              {/* To: <input type="date" id="to-input"/> */}
              Duration:
              <input
                type="text"
                onChange={handleDurationChange}
                id="duration-input"
              />{" "}
              days
            </p>
            <button className="button" onClick={() => handleBooking()}>
              Book!
            </button>
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

async function open3Box(addr) {
	box = await Box.openBox(addr, fm.getProvider());
	space = await box.openSpace(spaceName);
	await box.syncDone;
	await space.syncDone;
	console.log("Opened 3box box for ", addr);
}

async function set3BoxData(key, value) {
	await space.private.set(key, value);
	console.log("Set private value in 3box (key: ", key, ")");
}

async function get3BoxData(key) {
	await space.private.get(key);
	console.log("Got private value in 3box (key: ", key, ")");
}

async function remove3BoxData(key) {
	await space.private.remove(key);
	console.log("Removed private value in 3box (key: ", key, ")");
}
