import { AbiItem, keccak256 } from 'web3-utils';

import { BINANCE_NETWORK, SUPPORTED_SAFE_NETWORKS } from '~constants';
import { FunctionParamType } from '~data/index';

export interface AbiItemExtended extends AbiItem {
  name: string;
  type: 'function';
  action: string;
  methodSignature: string;
  signatureHash: string;
}

const getCurrentNetworkData = (chainId: number) => {
  return SUPPORTED_SAFE_NETWORKS.find((network) => network.chainId === chainId);
};

const getApiKey = (chainId: number) => {
  if (chainId === BINANCE_NETWORK.chainId) {
    return process.env.BSCSCAN_API_KEY;
  }
  return process.env.ETHERSCAN_API_KEY;
};

export const fetchContractName = async (
  contractAddress: string,
  safeChainId: number,
): Promise<string> => {
  // will be defined since fetchContractName is only called if selectedSafe is defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentNetworkData = getCurrentNetworkData(safeChainId)!;

  const apiKey = getApiKey(currentNetworkData.chainId);
  const apiUri = `${currentNetworkData.apiUri}?apiKey=${apiKey}&module=contract&action=getsourcecode&address=${contractAddress}`;

  try {
    const response = await fetch(apiUri);
    const data = await response.json();
    return data.result[0].ContractName || '';
  } catch (error) {
    console.error('Failed to get contract name', error);
    return '';
  }
};

export const fetchContractABI = async (
  contractAddress: string,
  safeChainId: number,
) => {
  if (!contractAddress) {
    return [];
  }

  try {
    // will be defined since fetchContractABI is only called if selectedSafe is defined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentNetworkData = getCurrentNetworkData(safeChainId)!;

    const getApiUri = () => {
      const apiUri = `${currentNetworkData.apiUri}?module=contract&action=getabi&address=${contractAddress}`;
      return `${apiUri}&apiKey=${getApiKey(currentNetworkData.chainId)}`;
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

/*
 * Function parameters are stored as `${paramName}-${functionName}`
 * In the SafeTransaction object.
 */
export const extractParameterName = (
  safeTransactionKey: string,
  functionName: string,
  functionParamType?: FunctionParamType,
) => {
  const endIdx = safeTransactionKey.indexOf(functionName);

  if (endIdx === -1 || !functionParamType) {
    return safeTransactionKey;
  }

  // -1 to exclude the hyphen, append param type
  return `${safeTransactionKey.substring(0, endIdx - 1)} (${
    functionParamType.type
  })`;
};

export const extractParameterType = (parameterName: string) => {
  const type = parameterName.split(' ');
  if (type.length < 2) {
    return parameterName;
  }
  // type follows parameter name by a space
  return type[1].substring(1, type[1].length - 1); // remove brackets
};
