import { axiosInstance } from './API/axiosInstance';
import API from './API/api.js';
import TextHelper from './data/TextHelper';
import OutputHelper from './data/OutputHelper';
import { useKeyPress, useLocalStorage, useGeoLocation } from './hooks';
import { socketInstance, useSocket, socketAuthCallback } from './socket';
import { web3 } from './eth/eth';

export {
  axiosInstance,
  API,
  TextHelper,
  OutputHelper,
  useKeyPress,
  useLocalStorage,
  useGeoLocation,
  socketInstance,
  useSocket,
  socketAuthCallback,
  web3,
};
