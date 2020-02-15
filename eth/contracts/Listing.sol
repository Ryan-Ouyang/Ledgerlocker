 pragma solidity ^0.5.0;
import "./DAILending.sol";

contract ListingManager is DAILending {

    struct Listing {
        uint256 price; // Token balance
        uint256 duration; // Duration in seconds
        uint256 timestamp; // timestamp until listing is available again
        address renter;
        address owner;
    }     
    
    // Event emitted when a listing is booked
    event listingBooked(uint256 _id);
    event listingClosed(uint256 _id);

    mapping (uint256 => Listing) listings;
    
    //---Interface---
    function getListing(uint256 _id) public view returns (
        uint256 _price, // Price per day
        uint256 _timestamp, // Timestamp until listing is available
        address _renter, 
        address _owner
    ) {
        Listing memory listing = listings[_id];
        return (listing.price, listing.timestamp, listing.renter, listing.owner);
    }
    
    // Creates a listing(uint256 _id)
    function createListing(
        uint256 _id,
        uint256 _price,
        uint256 _duration,
        uint256 _timestamp
    ) public {
        listings[_id] = Listing(_price, _duration, _timestamp, msg.sender, address(0));
    }
    
    // Books a listing 
    function bookListing(uint256 _id) public payable {
        Listing storage listing = listings[_id];
        require(listing.timestamp < block.timestamp, "Cannot rent in a listing that is not open");
        require(listing.owner != address(0), "Ensure listing exists");
        require(listing.owner != msg.sender, "Listing owner cannot be user");
        
        // Modify Listing
        listing.timestamp = getFutureTimestamp(listing.duration);
        listing.renter = msg.sender;
        
        // Stores the timelocked balance in the owner account
        _transfer(listing.owner, listing.price, listing.duration);
        
        emit listingBooked(_id);
    }
    
    function endListing(uint256 _id) public {
        Listing storage listing = listings[_id];
        require(listing.renter == msg.sender, "Listing renter is incorrect");
        
        listing.renter = address(0);
        
        emit listingClosed(_id);
    }
} 