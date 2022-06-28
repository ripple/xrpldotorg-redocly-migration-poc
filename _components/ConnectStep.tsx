import * as React from 'react';
import { XRPLoader } from './XRPLoader.tsx';

const NETWORK_URLS = {
  Testnet: 'wss://s.altnet.rippletest.net:51233',
  Devnet: 'wss://s.devnet.rippletest.net:51233',
  Mainnet: 'wss://xrplcluster.com',
};

export const ConnectStep = ({ useNetwork = 'Testnet' }) => {
  const wsUrl = NETWORK_URLS[useNetwork];
  return (
    <>
      <button id="connect-button" className="btn btn-primary" data-wsurl={wsUrl}>
        Connect to {useNetwork}
      </button>
      <div>
        <strong>Connection status:</strong>
        <span id="connection-status">Not connected</span>
        <XRPLoader message="Connecting..." />
      </div>
    </>
  );
};
