import React, { useState, useEffect } from "react";
import Box from "3box";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import axios from "axios";

import Navbar from "../Navbar/Navbar";
import BookingListing from "../BookingListing/BookingListing";

import "bulma/css/bulma.css";
import "./Booking.css";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9", "kovan");
let web3 = new Web3(fm.getProvider());

let box, space, thread, did;
let spaceName = "ledgerlocker";
let threadName = "ll";

export default function Bookings(props) {
  const [addr, setAddr] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingListings, setBookingListings] = useState([]);
  const [posts, setPosts] = useState([]);

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
    const createJoinThread = async () => {
      console.log(addr);
      console.log(fm.getProvider());
      box = await Box.openBox(addr, fm.getProvider());

      space = await box.openSpace(spaceName);
      await box.syncDone;
      await space.syncDone;
      const config = await Box.getConfig(addr);
      did = config.spaces[spaceName].DID;
      console.log("Bookings did ", did);
      console.log("Opened 3box in Bookings for ", addr);
      thread = await space.joinThread(threadName, {
        firstModerator: "did:3:0"
      });
      const _posts = await thread.getPosts();
      console.log("posts: ", _posts);
      setPosts(_posts);
      thread.onUpdate(async () => {
        const _posts = await thread.getPosts();
        setPosts(_posts);
      });
    };

    createJoinThread();
  }, [addr]);

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
        if (booking.renter.toLowerCase() == addr.toLowerCase()) {
          _bookingListings.push(booking);
        }
      });

      setBookingListings(_bookingListings);
    };

    fetchBookingListings();
  }, [bookings]);

  async function sendMessage() {
    let msg = document.getElementById("message-input");
    await thread.post(msg.value);
    msg.value = "";
    const _posts = await thread.getPosts();
    setPosts(_posts);
  }

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
                Chatting with owner
              </p>
              <br />
              <br />
              <div className="cbcontent is-size-5">
                <ul>
                  {posts.map((p, i) => {
                    if (p.author == did) {
                      return (
                        <div key={i}>
                          <li className="senderMsg">{p.message}</li>
                          <br />
                          <br />
                        </div>
                      );
                    } else {
                      return (
                        <div key={i}>
                          <li className="receiverMsg">{p.message}</li>
                          <br />
                          <br />
                        </div>
                      );
                    }
                  })}
                </ul>
              </div>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input className="input" type="text" id="message-input" />
                </div>
                <div className="control">
                  <a className="button is-info" onClick={sendMessage}>
                    Send
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}