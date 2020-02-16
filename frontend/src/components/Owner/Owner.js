import React, { useState, useEffect } from "react";
import Box from "3box";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import axios from "axios";

import Navbar from "../Navbar/Navbar";
import OwnerListing from "../OwnerListing/OwnerListing";

import "bulma/css/bulma.css";
import "./Owner.css";

const fm = new Fortmatic("pk_test_C0C9ADE8AD6C86A9", "kovan");
let web3 = new Web3(fm.getProvider());

let box;
let space;
let thread;
let did;

let spaceName = "ledgerlocker-test1";
let threadName = "ll";

export default function Owner(props) {
  const [addr, setAddr] = useState("");
  const [listings, setListings] = useState([]);
  const [ownerListings, setOwnerListings] = useState([]);
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
      await open3Box(addr);
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
    const fetchListings = async () => {
      const result = await axios("http://localhost:3001/api/listings");
      setListings(result.data);
    };

    fetchListings();
  }, [addr]);

  useEffect(() => {
    const fetchOwnerListings = async () => {
      let _ownerListings = [];

      listings.forEach(listing => {
        if (listing.owner.toLowerCase() == addr.toLowerCase()) {
          _ownerListings.push(listing);
        }
      });

      setOwnerListings(_ownerListings);
    };

    fetchOwnerListings();
  }, [listings]);

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
            <h1 className="is-size-1">My Listings</h1>
            {ownerListings.map((ol, i) => (
              <OwnerListing key={i} listing={ol} addr={addr}></OwnerListing>
            ))}
          </div>
          <div className="column is-half">
            <h1 className="is-size-1">Chat</h1>
            <div className="chatbox">
              <p className="is-size-4 chatboxheader has-background-grey-lighter">
                Chatting with renter
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

async function open3Box(addr) {
  box = await Box.openBox(addr, fm.getProvider());
  space = await box.openSpace(spaceName);
  await box.syncDone;
  await space.syncDone;
  const config = await Box.getConfig(addr);
  did = config.spaces[spaceName].DID;
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
