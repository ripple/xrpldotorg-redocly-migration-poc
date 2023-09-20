import * as React from 'react';

export function Sub(props) {
  return <sub>{props.children}</sub>;
}

export {
  StepWrapper,
  GenerateStep,
  ConnectStep,
  WaitStep,
  SendAccountNetStep,
  ConfirmSettingsStep,
} from '../../_components/InteractiveTutorials';
export { default as XRPLoader } from '../../_components/XRPLoader';
