import * as React from 'react';
import XRPLoader from './XRPLoader';

const NETWORK_URLS = {
  'Testnet': 'https://faucet.altnet.rippletest.net/accounts',
  'Devnet': 'https://faucet.devnet.rippletest.net/accounts',
}

export function GenerateStep({useNetwork = 'Testnet'}) {
  const faucetUrl = NETWORK_URLS[useNetwork];
  return (
    <>
      <button id="generate-creds-button" className="btn btn-primary" data-fauceturl={faucetUrl}>
        Get {useNetwork} credentials
      </button>
      <XRPLoader message="Generating Keys..." />
      <div className="output-area" />
    </>
  );
}
