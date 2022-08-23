import * as React from 'react';
import XRPLoader from './XRPLoader';
import slugify from './slugify';

const NETWORKS = {
  Testnet: {
    websocket: 'wss://s.altnet.rippletest.net:51233',
    faucet: 'https://faucet.altnet.rippletest.net/accounts',
    explorer: 'https://testnet.xrpl.org'
  },
  Devnet: {
    websocket: 'wss://s.devnet.rippletest.net:51233',
    faucet: 'https://faucet.devnet.rippletest.net/accounts',
    explorer: 'https://devnet.xrpl.org'
  },
  Mainnet: {
    websocket: 'wss://xrplcluster.com',
    faucet: null,
    explorer: 'https://livenet.xrpl.org'
  }
};

export function ConnectStep({ useNetwork = 'Testnet' }) {
  const wsUrl = NETWORKS[useNetwork].websocket;
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

export function GenerateStep({useNetwork = 'Testnet'}) {
  const faucetUrl = NETWORKS[useNetwork].faucet;
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

export function StepWrapper({ steps, stepIdx, children }) {
  const label = steps[stepIdx];
  const stepId = slugify(label).toLowerCase();
  return (
    <>
      <div className="interactive-block" id={`interactive-${stepId}`}>
        <div className="interactive-block-inner">
          <div className="breadcrumbs-wrap">
            <ul
              className="breadcrumb tutorial-step-crumbs"
              id={`bc-ul-${stepId}`}
              data-steplabel={label}
              data-stepid={stepId}
            >
              {steps.map((step, idx) => {
                const iterStepId = slugify(step).toLowerCase();
                let className = `breadcrumb-item bc-${iterStepId}`;
                if (idx > 0) className += ' disabled';
                if (iterStepId === stepId) className += ' current';
                return (
                  <li className={className} key={iterStepId}>
                    <a href={`#interactive-${iterStepId}`}>{step}</a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="interactive-block-ui">{children}</div>
        </div>
      </div>
    </>
  );
}

export function WaitStep({ useNetwork = 'Testnet' }) {
  const explorerUrl = NETWORKS[useNetwork].explorer;
  return (
    <table className="wait-step" data-explorerurl={explorerUrl}>
      <tbody>
        <tr>
          <th>Transaction ID:</th>
          <td className="waiting-for-tx">(None)</td>
        </tr>
        <tr>
          <th>Latest Validated Ledger Index:</th>
          <td className="validated-ledger-version">(Not connected)</td>
        </tr>
        <tr>
          <th>Ledger Index at Time of Submission:</th>
          <td className="earliest-ledger-version">(Not submitted)</td>
        </tr>
        <tr>
          <th>
            Transaction <code>LastLedgerSequence</code>:
          </th>
          <td className="lastledgersequence">(Not prepared)</td>
        </tr>
        <tr className="tx-validation-status"></tr>
      </tbody>
    </table>
  );
}
