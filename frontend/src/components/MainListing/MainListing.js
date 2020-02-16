import React, { useState } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MainListing(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [duration, setDuration] = useState(86400);

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
        alert(
          `Booked listing with id: ${props.listing.id} and duration ${duration}`
        )
      );
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
          {props.listing.address} - {props.listing.rent} DAI/day
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
              Daily Rent: {props.listing.rent}
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
