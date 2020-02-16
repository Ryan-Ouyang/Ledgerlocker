import React, { useState, useEffect } from "react";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import axios from "axios";

import Navbar from "../Navbar/Navbar";
import BookingListing from "../BookingListing/BookingListing";

import "bulma/css/bulma.css";
import "./Booking.css";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9", "kovan");
let web3 = new Web3(fm.getProvider());

export default function Bookings(props) {
  const [addr, setAddr] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingListings, setBookingListings] = useState([]);

  useEffect(() => {
    const loginUser = async () => {
      web3.eth.getAccounts().then(async address => {
        setAddr(address[0]);
        web3.eth.defaultAccount = `${address[0]}`;
      });
    };

    loginUser();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const result = await axios("http://localhost:3001/api/listings/booked");
      setBookings(result.data);
    };

    fetchBookings();
  }, [addr]);

  useEffect(() => {
    const fetchBookingListings = async () => {
      let _bookingListings = [];

      bookings.forEach(booking => {
        console.log(booking.renter);
        if (booking.renter == addr) {
          _bookingListings.push(booking);
        }
      });

      setBookingListings(_bookingListings);
    };

    fetchBookingListings();
  }, [bookings]);

  return (
    <>
      <Navbar addr={addr} />
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <h1 className="is-size-1">My Bookings</h1>
            {bookingListings.map((ol, i) => (
              <BookingListing key={i} listing={ol} addr={addr}></BookingListing>
            ))}
          </div>
          <div className="column is-half">
            <h1 className="is-size-1">Chat</h1>
            <div className="chatbox">
              <p className="is-size-4 chatboxheader has-background-grey-lighter">
                Chatting with 0x123455032032233242343225fsdfs
              </p>
              <br />
              <br />
              <div className="cbcontent is-size-5">
                <ul>
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                  <li className="receiverMsg">test</li>
                  <br />
                  <br />
                  <li className="senderMsg">test</li>
                  <br />
                  <br />
                </ul>
              </div>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input className="input" type="text" />
                </div>
                <div className="control">
                  <a className="button is-info">Send</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
