pragma solidity ^0.5.0;
import "./Lending.sol";
import "./Reputation.sol";

// An implementation of handling automated listings
contract ListingManager is Lending, Reputation {
    struct Listing {
        uint256 price; // Token balance
        uint256 timestamp; // timestamp until listing is available again
        address renter;
        address owner;
    }

    // Event emitted when a listing is booked, canceled, created
    event listingCreated(uint256 _id, uint256 _price, bool _booked, address _renter, address _owner);
    event listingBooked(uint256 _id, uint256 _price, bool _booked, address _renter, address _owner);
    event listingClosed(uint256 _id, uint256 _price, bool _booked, address _renter, address _owner);

    mapping(uint256 => Listing) listings;
    
    // Users will need to stake 2 times the amount required to facilitate a payment
    uint256 stakeMultiplier = 2;

    //---Interface---
    function _isBooked(uint256 _timestamp) internal view returns (bool) {
        return _timestamp < block.timestamp;
    }
    
    function getListing(uint256 _id)
        public
        view
        returns (
            uint256 _price, // Price per day
            bool _booked,   // Timestamp until listing is available
            address _renter,
            address _owner
        )
    {
        Listing memory listing = listings[_id];
        return (
            listing.price,
            _isBooked(listing.timestamp),
            listing.renter,
            listing.owner
        );
    }
    
    /**
     * Gets the total price of a listing 
     * @param _listingPrice the price per day
     * @param _duration     the duration of the stay in seconds
     */ 
    function _getPrice(uint256 _listingPrice, uint256 _duration) internal pure returns (uint256) {
        return _listingPrice * (_duration / 86400);
    }
    
    //---Implementation

    // Creates a listing(uint256 _id)
    function createListing(
        uint256 _id,
        uint256 _price // Price per day
    ) public {
        Listing memory listing = Listing(_price, 0, address(0), msg.sender);
        listings[_id] = listing;
        emit listingBooked(_id, listing.price, _isBooked(listing.timestamp), listing.renter, listing.owner);
    }

    /**
     * Books a listing
     * @param _id       The id of the listing
     * @param _duration The duration of the stay in seconds
     */
    function bookListing(uint256 _id, uint256 _duration) public {
        Listing storage listing = listings[_id];
        require(
            listing.timestamp < block.timestamp,
            "Cannot rent in a listing that is not open"
        );
        require(listing.owner != address(0), "Ensure listing exists");
        require(listing.owner != msg.sender, "Listing owner cannot be user");
        
        // Get the price 
        uint256 price = _getPrice(listing.price, _duration);
        require(price != 0, "Price should not be zero");
        
        // Modify Listing
        listing.timestamp = getFutureTimestamp(_duration);
        listing.renter = msg.sender;

        // Stores the timelocked balance in the owner account
        _transfer(listing.owner, price, price * stakeMultiplier, _duration);

        emit listingBooked(_id, price, _isBooked(listing.timestamp), listing.renter, listing.owner);
    }

    /**
     * Ends the listing
     * @param _id The id of the listing
     */

    function endListing(uint256 _id) public {
        Listing storage listing = listings[_id];
        require(listing.renter == msg.sender, "Listing renter is incorrect");

        listing.renter = address(0);

        emit listingClosed(_id, listing.price, _isBooked(listing.timestamp), listing.renter, listing.owner);
    }
}
