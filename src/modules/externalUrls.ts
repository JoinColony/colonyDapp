import { GNOSIS_AMB_BRIDGES } from '~constants';

/* eslint-disable max-len */
export const BEAMER_NEWS = `https://news.colony.io/en`;
export const BEAMER_BUGS = `https://news.colony.io/requests/en`;
export const BEAMER_LIBRARY = 'https://app.getbeamer.com/js/beamer-embed.js';
export const HELP = `https://docs.colony.io/learn/`;
export const BETA_DISCLAIMER = `https://docs.colony.io/use/beta`;
export const TERMS_AND_CONDITIONS = `https://colony.io/pdf/terms.pdf`;

/*
 * Utils
 */
export const SETUP_NATIVE_TOKEN = `https://docs.colony.io/use/launch-a-colony/#step-2-setup-your-token`;
export const TOKEN_LOGOS_REPO = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains`;
export const NETWORK_RELEASES = `https://github.com/JoinColony/colonyNetwork/releases/tag`;
export const ETHERSCAN_CONVERSION_RATE = `https://api.etherscan.io/api?module=stats&action=ethprice`;
export const ETH_GAS_STATION = `https://ethgasstation.info/json/ethgasAPI.json`;
export const XDAI_GAS_STATION = `https://gnosis.blockscout.com/api/v1/gas-price-oracle`;
export const getBlockscoutUserURL = (userAddress: string) =>
  `https://blockscout.com/xdai/mainnet/address/${userAddress}/transactions`;

/*
 * Motions and Disputes
 */
export const MD_OBJECTIONS_HELP = `https://docs.colony.io/use/governance/motions-and-disputes/objecting-and-creating-a-dispute`;
export const MD_REPUTATION_INFO = `https://docs.colony.io/use/reputation/`;

/*
 * Token
 */
export const TOKEN_ACTIVATION_INFO = `https://docs.colony.io/use/managing-funds/token-activation`;
export const TOKEN_UNLOCK_INFO = `https://docs.colony.io/use/managing-funds/unlock-token`;

/*
 * Wallet
 */
export const WALLET_CONNECT_XDAI = `https://docs.colony.io/use/additional-guides/connect-metamask-to-xdai`;

/*
 * Recovery Mode
 */
export const RECOVERY_HELP = `https://docs.colony.io/use/advanced-features/recovery-mode`;

/*
 * Reputation & Smite
 */
export const REPUTATION_LEARN_MORE = `https://docs.colony.io/use/reputation/award-reputation`;

/*
 * Metatransactions
 */
export const METATRANSACTIONS_LEARN_MORE = `https://docs.colony.io/use/advanced-features/gasless-transactions/`;

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
