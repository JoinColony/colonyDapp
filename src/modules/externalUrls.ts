import { GNOSIS_AMB_BRIDGES } from '~constants';

/* eslint-disable max-len */

export const HELP = `https://colony.gitbook.io/colony`;
export const BETA_DISCLAIMER = `https://colony.gitbook.io/colony/disclaimers/beta`;
export const TERMS_AND_CONDITIONS = `https://colony.io/pdf/terms.pdf`;

/*
 * Utils
 */
export const TOKEN_LOGOS_REPO = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains`;
export const NETWORK_RELEASES = `https://github.com/JoinColony/colonyNetwork/releases/tag`;
export const ETHERSCAN_CONVERSION_RATE = `https://api.etherscan.io/api?module=stats&action=ethprice`;
export const ETH_GAS_STATION = `https://ethgasstation.info/json/ethgasAPI.json`;
export const XDAI_GAS_STATION = `https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle`;
export const getBlockscoutUserURL = (userAddress: string) =>
  `https://blockscout.com/xdai/mainnet/address/${userAddress}/transactions`;

/*
 * Motions and Disputes
 */
export const MD_OBJECTIONS_HELP = `https://colony.io/dev/docs/colonynetwork/whitepaper-tldr-objections-and-disputes#objections`;
export const MD_REPUTATION_INFO = `https://colony.gitbook.io/colony/key-concepts/reputation`;

/*
 * Token
 */
export const TOKEN_ACTIVATION_INFO = `https://colony.gitbook.io/colony/key-concepts/token-activation`;
export const TOKEN_UNLOCK_INFO = `https://colony.gitbook.io/colony/manage-funds/unlock-token`;

/*
 * Wallet
 */
export const WALLET_CONNECT_XDAI = `https://colony.gitbook.io/colony/get-started/connect-metamask-to-xdai`;

/*
 * Recovery Mode
 */
export const RECOVERY_HELP = `https://colony.gitbook.io/colony/advanced-features/recovery-mode`;

/*
 * Reputation & Smite
 */
export const REPUTATION_LEARN_MORE = `https://colony.gitbook.io/colony/key-concepts/reputation/award-reputation`;

/*
 * Metatransactions
 */
export const METATRANSACTIONS_LEARN_MORE = `https://colony.gitbook.io/colony/announcements/metatransactions`;

/*
 * Safe control
 */
export const SAFE_INTEGRATION_LEARN_MORE = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/controlling-a-safe`;

export const CONNECT_SAFE_INSTRUCTIONS = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/adding-a-safe#step-2-connect-the-safe`;

const SAFE_APP = `https://app.safe.global`;

export const getSafeLink = (chainShortName: string, safeAddress: string) =>
  `${SAFE_APP}/${chainShortName}:${safeAddress}`;

export const getModuleLink = (chainShortName: string, safeAddress: string) =>
  `${getSafeLink(
    chainShortName,
    safeAddress,
  )}/apps?appUrl=https%3A%2F%2Fzodiac.gnosisguild.org%2F`;

export const MODULE_ADDRESS_INSTRUCTIONS = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/adding-a-safe#finding-the-module-contract-address`;

export const SAFE_CONTROL_LEARN_MORE = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/#how-it-all-works`;

export const ADD_SAFE_INSTRUCTIONS = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/adding-a-safe`;

export const getSafeTransactionMonitor = (
  chainId: string,
  transactionHash: string,
) => {
  const monitorUrl = GNOSIS_AMB_BRIDGES[chainId].monitor;

  return `${monitorUrl}100/${transactionHash}`;
};

/* eslint-enable max-len */
