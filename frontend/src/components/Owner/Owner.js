import React, { useState, useEffect } from "react";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import axios from "axios";

import Navbar from "../Navbar/Navbar";

import "bulma/css/bulma.css";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9", "kovan");
let web3 = new Web3(fm.getProvider());

export default function Owner(props) {
  const [addr, setAddr] = useState("");
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [ownerListings, setOwnerListings] = useState([]);

  useEffect(() => {
    const loginUser = async () => {
      web3.eth.getAccounts().then(async address => {
        setAddr(address[0]);
        // addr = address[0]
        console.log("Address: ", address[0]);
        web3.eth.defaultAccount = `${address[0]}`;
      });
    };
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      const result = await axios("http://localhost:3001/api/listings");
      setListings(result.data);
      console.log("Fetched listings");
    };

    const fetchBookings = async () => {
      const result = await axios("http://localhost:3001/api/listings/booked");
      setBookings(result.data);
      console.log("Fetched bookings");
    };

    //loginUser();
    fetchListings();
    fetchBookings();
  }, [addr]);

  useEffect(() => {
    const fetchOwnerListings = async () => {
      let _ownerListings = [];

      listings.forEach(listing => {
        let ownerListing = bookings.find(b => b.listingId == listing.id);
        console.log(listing);
        if (ownerListing != null) {
          _ownerListings.push(listing);
        }
      });

      console.log("fetched owner listings");
      console.log(_ownerListings);
      setOwnerListings(_ownerListings);
    };

    fetchOwnerListings();
  }, [listings, bookings]);

  return (
    <>
      <Navbar addr={addr} />
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <h1 className="is-size-1">My Listings</h1>
            {ownerListings.map((ol, i) => (
              <p key={i}>{ol.id}</p>
            ))}
          </div>
          <div className="column is-half">
            <h1 className="is-size-1">Chat</h1>
          </div>
        </div>
      </div>
    </>
  );
}
