import React from 'react';

import BookingListing from "./BookingListing";

export default function Bookings(props) {
    var homes = [
        {
            name: "Apartment A",
            key: 1,
            address: "Forest Park, GA",
            rent: "45 DAI/day",
            stake: 2,
            description:
                "123 Broadway, Denver near ABC Mall. Walking score 95, with everything you can want within 5 minutes walking distance. House was just renovated and has hardwood floors, new kitchen appliances, and renovated bathrooms. A great place to call it your home!",

            images: [
                "https://www.padsplit.com/img/rooms/room_866_0_1578610474.769763.jpg",
                "https://www.padsplit.com/img/rooms/room_866_1_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_4_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_3_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_2_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_1_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_0_1578610474.769763.jpg"
            ],
            purchaseTS: 1578700800,
            bookingTS: 1581638400,
            bookingLength: 172800,
            doorOpen: false,
            doorLocked: false,
            checkedIn: true
        },
        {
            name: "Apartment B",
            key: 2,
            address: "Denver, CO",
            rent: "50 DAI/day",
            stake: 2,
            description:
                "123 Broadway, Denver near ABC Mall. Walking score 95, with everything you can want within 5 minutes walking distance. House was just renovated and has hardwood floors, new kitchen appliances, and renovated bathrooms. A great place to call it your home!",

            images: [
                "https://www.padsplit.com/img/rooms/room_866_0_1578610474.769763.jpg",
                "https://www.padsplit.com/img/rooms/room_866_1_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_4_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_3_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_2_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_1_1578610474.769763.jpg",
                "https://www.padsplit.com/img/psproperty/psproperty_158_0_1578610474.769763.jpg"
            ],
            purchaseTS: 1433808000,
            bookingTS: 1585008000,
            bookingLength: 604800,
            doorOpen: false,
            doorLocked: false,
            checkedIn: false
        }
    ];

    return (
        <>
            <h1 className="title">Your Bookings</h1>
            <div class="columns">
                <div class="column">
                    {homes.map((l, i) => (
                        <BookingListing key={i} listing={l}></BookingListing>
                    ))}
                </div>
                <div class="column">
                    Second column
                </div>
            </div>
        </>
    );
}