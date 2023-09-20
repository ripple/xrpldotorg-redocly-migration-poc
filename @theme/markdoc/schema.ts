import { Schema } from '@markdoc/markdoc';

export const interactiveStepWrapper: Schema & { tagName: string } = {
  tagName: 'interactive-step-wrapper',
  attributes: {
    stepIdx: {
      type: 'Number',
    },
    steps: {
      type: 'Array',
    },
  },
  render: 'StepWrapper', // please make sure to export it in components.ts
};

export const generateStep: Schema & { tagName: string } = {
  tagName: 'generate-step',
  render: 'GenerateStep',
};

export const connectStep: Schema & { tagName: string } = {
  tagName: 'connect-step',
  render: 'ConnectStep',
};

export const waitStep: Schema & { tagName: string } = {
  tagName: 'wait-step',
  render: 'WaitStep',
};

export const accountNetStep: Schema & { tagName: string } = {
  tagName: 'send-accountnet-step',
  render: 'SendAccountNetStep',
};

export const confirmSettingsStep: Schema & { tagName: string } = {
  tagName: 'confirm-settings-step',
  render: 'ConfirmSettingsStep',
};