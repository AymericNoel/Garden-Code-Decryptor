# Garden access code decryptor

## About The Project


This project is linked to https://zeroknowledgegarden.surge.sh/.

Originally, garden access codes are published on the blockchain and are therefore accessible to everyone. So, it was necessary to encrypt the gardens access codes with the users' public keys so that only them could decrypt with their private keys.

This project aims to provide a desktop software totally disconnected from the internet to be able to decode the access code of the gardens with the user's private key with the most security possible.

<ins>How does it work?</ins>

The user enters his private key and the encrypted access code of the garden recovered from the blockchain. Then thanks to the Eth-crypto library, the code is decrypted.

An additional functionality is available : the verification of the obtained access code. Indeed, the user can enter the hash of the access code recovered from the blockchain. If this hash and the hash of the decrypted code match, the code is considered valid.

This security ensures that the owner of the garden has encrypted the same access code as the one hashed and put on the blockchain. 


## Built With

* [Electron](https://www.electronjs.org/)
* [Eth-crypto](https://github.com/pubkey/eth-crypto)

<br/>

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You need to have node and npm installed on your computer.
* Node <br/>
You can download node from the official [website](https://nodejs.org/en/download/).


* Npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/AymericNoel/Garden-Code-Decryptor.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Run the desktop software locally 

```sh
npm start
```
### Create software installer for mac, linux or windows

For windows, run : 
   ```sh
   npm run build-installer:windows
   ```

For mac (doesn't work on windows computers), run : 
   ```sh
   npm run build-installer:mac
   ```

For linux (doesn't work on windows computers), run : 
   ```sh
   npm run build-installer:linux
   ```
### Run the tests

```sh
npm run test
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Aymeric NOEL - aymeric.noel@octo.com

Project Link : [https://github.com/AymericNoel/POC_OCTO_ZKP](https://github.com/AymericNoel/POC_OCTO_ZKP)
