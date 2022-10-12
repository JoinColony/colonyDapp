import { AbiItem, keccak256 } from 'web3-utils';

import {
  BINANCE_NETWORK,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants';

export interface AbiItemExtended extends AbiItem {
  name: string;
  type: 'function';
  action: string;
  methodSignature: string;
  signatureHash: string;
}

export const fetchContractABI = async (
  contractAddress: string,
  safeChainId: number,
) => {
  if (!contractAddress) {
    return [];
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentNetworkData = SUPPORTED_SAFE_NETWORKS.find(
      (network) => network.chainId === safeChainId,
    )!; // will be defined since fetchContractABI is only called if selectedSafe is defined

    const getApiKey = () => {
      if (currentNetworkData.chainId === BINANCE_NETWORK.chainId) {
        return process.env.BSCSCAN_API_KEY;
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

    return responseJSON;
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

export const isAbiItem = (value: unknown): value is AbiItem[] => {
  return (
    Array.isArray(value) &&
    value.every((element) => typeof element === 'object')
  );
};

export const getContractUsefulMethods = (contractABI: string | undefined) => {
  let parsedContractABI: AbiItem[] = [];
  let usefulMethods: AbiItemExtended[] = [];

  try {
    parsedContractABI = JSON.parse(contractABI || '[]');
    if (!isAbiItem(parsedContractABI)) {
      throw new Error('Contract ABI is not valid');
    }
  } catch (error) {
    console.error(error);
    parsedContractABI = [];
  } finally {
    usefulMethods = extractUsefulMethods(parsedContractABI);
  }

  return usefulMethods;
};
