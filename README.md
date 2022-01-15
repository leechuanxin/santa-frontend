<div id="top"></div>

# Wish Upon A Santa

<img width="1440" alt="Screenshot 2022-01-16 at 2 05 27 AM" src="https://user-images.githubusercontent.com/7672836/149632852-3e6921da-4708-42c1-93b4-7dfb88fc0b79.png">

<img width="1440" alt="Screenshot 2022-01-16 at 2 06 42 AM" src="https://user-images.githubusercontent.com/7672836/149632854-c6273081-8b80-4781-ac26-5d2b6cdb3cd3.png">

## Get into the spirit of gifting with Blockchain and NFTs!

Wish upon a Santa is an online Christmas-themed wishing well that allows users to make wishes, as well as grant wishes made by other users.

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
  	<li>
      <a href="#introduction">Introduction</a>
    </li>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#tech">Tech</a>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#retrospective">Retrospective</a></li>
	 <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- INTRODUCTION -->

## Introduction

This decentralised application (dApp) is deployed on the Rinkeby testnet instead of the Ethereum mainnet, so that anyone can come and use the site without spending actual Ether (ETH) to make and grant wishes.

Similar to an online store, we have a tongue-in-cheek catalogue and users can **wish for items** on the catalogue. Just like tossing a coin into a wishing well, only a small [gas fee](https://www.investopedia.com/terms/g/gas-ethereum.asp#:~:text=Gas%20fees%20are%20payments%20made,spend%20on%20a%20particular%20transaction.) in ETH has to be paid for **making a wish**.

*Granting a wish* works like purchasing an item from an online store to gift to someone else. Every item in our catalogue has a preset price. When *granting a wish*, a user has to pay the price of the item another user has wished for. The price paid in ETH for *granting a wish* goes to the smart contract (ie. our "online store", or us).

To incentivise users to get into the spirit of gifting, the dApp rewards Goodwill points to users who have *granted wishes*. Goodwill points can be used to claim NFT badges that can be displayed on one's profile. The dApp also has a leaderboard to feature the top wish granters.

Here are the links to our [frontend](https://github.com/leechuanxin/santa-frontend), [Express backend](https://github.com/leechuanxin/santa-express), and [smart contract](https://github.com/JustinWong98/santa-blockchain) repositories.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- FEATURES -->

## Features

- Allows users to make their own wishes (in the form of minting them as NFT tokens)
- Users can grant wishes for others through cryptocurrency
- Compete for the top positions in the leaderboard through granting wishes
- Redeem NFT badges as a reward for granting wishes
- See all the wishes a user has made or granted, and the badges they have claimed

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- TECH -->

## Tech

We use:

- [Solidity] - For coding our smart contract on the blockchain. With our smart contract as our "primary backend", we store ownership information of the wishes made, and the NFT badges redeemed.
- [Express](https://expressjs.com/) - Our "secondary backend", for cosmetic purposes: usernames will be attached to each wallet address for identification purposes.
- [web3.js](https://web3js.readthedocs.io/en/v1.5.2/) - To interact with our smart contract, as well as offer cryptocurrency transactions for making wishes (by paying a [gas fee](https://www.investopedia.com/terms/g/gas-ethereum.asp#:~:text=Gas%20fees%20are%20payments%20made,spend%20on%20a%20particular%20transaction.)) and granting wishes (by paying the price of the item wished to the smart contract, ie. us).
- [React] - Front-end development, with Bootstrap as our key UI library.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE -->

## Usage

You can visit our deployed app [here](https://damp-bayou-29307.herokuapp.com).

<img width="1440" alt="Screenshot 2022-01-16 at 3 29 18 AM" src="https://user-images.githubusercontent.com/7672836/149635329-1d3e45a3-e370-4717-ba92-2554dc43401a.png">

1. Go to [MetaMask's site](https://metamask.io/). Download the Chrome extension and register for an account.

![](https://user-images.githubusercontent.com/84217227/148346096-2c66414c-3b53-4728-8a5f-9ea67f0c5d1c.gif)

2. Once you have the Chrome extension and account, go to our [landing page](https://damp-bayou-29307.herokuapp.com). Ensure that your MetaMask wallet account is connected to the site, and the Rinkeby testnet.

<img width="1440" alt="Screenshot 2022-01-16 at 3 08 51 AM" src="https://user-images.githubusercontent.com/7672836/149634907-e817e47e-2c93-4e9a-892a-d3fb1282c598.png">

3. For your first-time logging in, we will request for a username for which you will be identified when using the application.

![](https://user-images.githubusercontent.com/84217227/148346688-6ce47b2e-6ec7-40ea-91bc-b4ceb66bcd59.gif)

4. On logging in, you will be brought to the main page where you can see a list of Wishes you can grant, or make your own Wish. Click on the green 'Grant' button on any of the Wishes to grant a Wish.

<img width="1440" alt="Screenshot 2022-01-16 at 3 18 01 AM" src="https://user-images.githubusercontent.com/7672836/149635017-f84ea257-d92c-4af4-9c09-0f20346f364a.png">

5. Click on the red 'Make a Wish!' button on the same page, and you will be redirected to a form to make a Wish. Type and select an item to wish for, fill in the rest of the information, then click on the red 'Make Wish' button to finish making your Wish.

<img width="1440" alt="Screenshot 2022-01-16 at 3 19 31 AM" src="https://user-images.githubusercontent.com/7672836/149635107-f766480d-2243-4611-bde5-19e7a2cfd579.png">

6. If you have granted a couple of Wishes per step (4), you would have accumulated a number of Goodwill points. Click on the Badge icon on the left navigation bar to visit a list of Badges. Click on the green Redeem button on any of the Badges to redeem them with your Goodwill points.

<img width="1440" alt="Screenshot 2022-01-16 at 3 21 51 AM" src="https://user-images.githubusercontent.com/7672836/149635155-98c6aaad-e40f-456b-bb3d-e4f6c565fa97.png">

7. Click on the Users icon on the left navigation bar to search for the users on the platform. Click on any of their profile usernames to view their profile pages.

<img width="1436" alt="Screenshot 2022-01-16 at 3 22 00 AM" src="https://user-images.githubusercontent.com/7672836/149635180-b61df541-3598-45a2-a88f-494259f08b47.png">

8. To view your own profile, simply click on your own avatar image on the left navigation bar. You will be brought to your own profile page to view your Wishes, Granted Wishes and Badges.

<img width="1440" alt="Screenshot 2022-01-16 at 3 25 54 AM" src="https://user-images.githubusercontent.com/7672836/149635242-26798ffc-1ed7-4028-af78-5891847f5ee7.png">

9. Click on the Trophy icon on the left navigation bar to view the leaderboard. The leaderboard ranks users based on their lifetime accumulated Goodwill points, which is determined the number of Wishes they have granted.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

WIP

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- RETROSPECTIVE -->

## Retrospective

- Data storage: it can be potentially expensive storing unessential information on our smart contracts. Code optimisation is important to reduce code space, but this also means having different data modelled on the smart contracts and our Express backend. Working off 2 databases can be tricky in authentication and mapping the data together accurately.
- We have to avoid using redundant loops and arrays in our functions due to the code size quickly increasing. We had to keep our code under 24576 bytes (see https://soliditydeveloper.com/max-contract-size). With JavaScript as our first programming language, this means we had to avoid re-creating some of our beloved array methods in Solidity - instead we do a lot of data filtering and cleaning on the front-end.
- We wanted to follow ERC-721 standard when implementing NFTs. It was difficult to plan the ownership of wishes, when implemented as NFTs. When involving ownership transfers, we could not use ERC-721's in-built methods like `safeTransfer` because of the original complicated workflow: initially, we plan to have the user mint a wish as an NFT, but have the smart contract own the NFT instead. Only when the wish is granted does the ownership transfer to the wisher. In the end, we simplified wishes to be minted only by the wisher themselves, and not involve any ownership transfers.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[Justin Wong](https://github.com/JustinWong98) - justinwong8991@gmail.com

[Chuan Xin](https://github.com/leechuanxin) - chuanxin.lee@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

MIT

<p align="right">(<a href="#top">back to top</a>)</p>

   [frontend]: <https://github.com/leechuanxin/santa-frontend>
   [smart-contract]: <https://github.com/JustinWong98/santa-blockchain>
   [Truffle]: <https://trufflesuite.com/truffle/>
   [PostgreSQL]: <https://www.postgresql.org>
   [node.js]: <http://nodejs.org>
   [React]: <https://reactjs.org>
   [express]: <http://expressjs.com>
   [Solidity]: <https://soliditylang.org>
   [React Bootstrap]: <https://react-bootstrap.github.io>
