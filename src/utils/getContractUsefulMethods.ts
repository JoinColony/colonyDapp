import { AbiItem, isAddress, keccak256 } from 'web3-utils';

import {
  BINANCE_NETWORK,
  GNOSIS_NETWORK,
  GNOSIS_SAFE_NETWORKS,
  POLYGON_NETWORK,
} from '~constants';

export interface AbiItemExtended extends AbiItem {
  name: string;
  type: 'function';
  action: string;
  methodSignature: string;
  signatureHash: string;
}

const fetchContractABI = async (
  contractAddress: string,
  safeChainId: number,
) => {
  if (!contractAddress) {
    return [];
  }

  try {
    const currentNetworkData =
      GNOSIS_SAFE_NETWORKS.find((network) => network.chainId === safeChainId) ||
      GNOSIS_NETWORK;
    const getApiKey = () => {
      if (currentNetworkData.chainId === POLYGON_NETWORK.chainId) {
        return process.env.POLYGONSCAN_API_KEY;
      }
      if (currentNetworkData.chainId === BINANCE_NETWORK.chainId) {
        return process.env.BSCSCAN_API_KEY;
      }
      if (currentNetworkData.chainId === GNOSIS_NETWORK.chainId) {
        return process.env.GNOSIS_API_KEY;
      }
      return process.env.ETHERSCAN_API_KEY;
    };
    const getApiUri = () => {
      const apiUri = `${currentNetworkData.apiUri}?module=contract&action=getabi&address=${contractAddress}`;
      return `${apiUri}&apiKey=${getApiKey()}`;
    };
    const response = await fetch(getApiUri());

    if (!response.ok) {
      return [];
    }

    const responseJSON = await response.json();

    return responseJSON.result || responseJSON.message;
  } catch (error) {
    console.error('Failed to retrieve ABI', error);
    return '';
  }
};

const extractUsefulMethods = (abi: AbiItem[]): AbiItemExtended[] => {
  const extendedAbiItems = abi.filter(
    ({ name, type }) => type === 'function' && !!name,
  ) as AbiItemExtended[];
  const getMethodSignatureAndSignatureHash = (
    method: AbiItem,
  ): { methodSignature: string; signatureHash: string } => {
    const params = method.inputs?.map((x) => x.type).join(',');
    const methodSignature = `${method.name}(${params})`;
    const signatureHash = keccak256(methodSignature).toString();
    return { methodSignature, signatureHash };
  };
  const getMethodAction = ({ stateMutability }: AbiItem): 'read' | 'write' => {
    if (!stateMutability) {
      return 'write';
    }
    return ['view', 'pure'].includes(stateMutability) ? 'read' : 'write';
  };

  return extendedAbiItems
    .map((method) => ({
      ...getMethodSignatureAndSignatureHash(method),
      ...method,
      action: getMethodAction(method),
    }))
    .sort(({ name: a }, { name: b }) => {
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    });
};

export const getContractUsefulMethods = (
  contractAddress: string | undefined,
  contractABI: string | undefined,
  safeChainId: number,
  handleContractABIChange: (abi: string) => void,
) => {
  let parsedContractABI: AbiItem[];

  if (!contractABI && contractAddress && isAddress(contractAddress)) {
    const contractPromise = fetchContractABI(contractAddress, safeChainId);
    contractPromise.then((data) => {
      handleContractABIChange(data);
    });
  }

  try {
    parsedContractABI = JSON.parse(contractABI || '[]');
  } catch (error) {
    console.error(error);
    parsedContractABI = [];
  }

  const usefulMethods = extractUsefulMethods(parsedContractABI);

  return usefulMethods;
};
