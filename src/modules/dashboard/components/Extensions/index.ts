import { Extension } from '@colony/colony-js';

export { default } from './Extensions';
export { default as ExtensionDetails } from './ExtensionDetails';

// List of extensions allowed for use within the Dapp
export const dappExtensions = [
  Extension.OneTxPayment,
  Extension.VotingReputation,
];
