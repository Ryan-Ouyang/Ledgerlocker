![Header](readme/Header.png)
# ledgerlocker
#BUILDLed at ETHDenver 2020


# Staking Protocol
We built a generic staking protocol that allows smart contract owner to earn interest while maintaining account balances.
Any DAI that is received from the smart contract can be directed to DSR where the smart contract owner is the recipient of the interest. 

We want users to keep their funds but also allow smart contract owners to monetize their services through interest.

Think POOLTOGETHER but instead the balance is going straight to the owner. 

## Use Cases

### ETHDenver Staking
The ETHDenver staking contract: https://etherscan.io/address/0xcf4301f7f4315e98b6ecdc5df67d18f68c1e7720

The numbers: **$82,978.94** is currently staked and just sitting in the smart contract.

We are able to integrate the Staking Protocol fairly easily to manage user funds while earning interest on $82k.
With the current DSR of **7.5%**, and an assumption that the current balance will be staked for just 1 month.

$82,978 * 0.075 / 12 = **$518.61** that could be potentially earned by the ETHDenver team.

That's 26 **B IS FOR BUFFICORN** Books!!
![Meme](readme/Why-Cant-I-Hold-All-These-Limes.jpg)

### Buyer / Seller Marketplace

# Hardware Prototype

![Front picture](readme/front.jpg)

We decided to use apply this protocol to a specific use case for demoing: the experience of home leasing. In this example, a person looking to lease a home stakes an amount correlating to the daily rent price. They then check in by entering a generated code displayed at the door, and can unlock the door via a portal app.

This fee-free model allows homeowners to charge less, while enabling the service to run sustainably.

![Front picture](readme/side.jpg)

For the proof of concept, we built a working door (with open AND close functionality). It has an OLED display that shows the door's state and the unique ID sent to the door. The entire hardware prototype is based off an ESP8266 device, which sends and receives data via WebSockets. The piece of aluminum on the side of the frame lets the door detect if it's closed so that it can lock itself after the user. The latch is controlled by a TowerPro SG90 servo motor.

![Front picture](readme/back.jpg)

