import Web3 from 'web3';

export const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");