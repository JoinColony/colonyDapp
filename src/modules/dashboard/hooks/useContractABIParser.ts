import { useEffect, useState } from 'react';
import { AbiItem, keccak256 } from 'web3-utils';

export interface AbiItemExtended extends AbiItem {
  name: string;
  type: 'function';
  action: string;
  methodSignature: string;
  signatureHash: string;
}

export const fetchContractABI = async (contractAddress: string) => {
  if (!contractAddress) {
    return [];
  }

  try {
    const apiUri = `https://api.etherscan.io/api?module=contract&action=getAbi&address=${contractAddress}&apiKey=${process.env.ETHERSCAN_API_KEY}`;
    const response = await fetch(apiUri);

    if (!response.ok) {
      return [];
    }

    const responseJSON = await response.json();

    return responseJSON.result;
  } catch (error) {
    console.error('Failed to retrieve ABI', error);
    return '';
  }
};

export const extractUsefulMethods = (abi: AbiItem[]): AbiItemExtended[] => {
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

export const useContractABIParser = (contractAddress?: string) => {
  const [
    currentParsedContractAddress,
    setCurrentParsedContractAddress,
  ] = useState<string>('');
  const [contractABI, setContractABI] = useState<string>('');
  const [usefulMethods, setUsefulMethods] = useState<AbiItemExtended[]>([]);

  useEffect(() => {
    if (contractAddress && currentParsedContractAddress !== contractAddress) {
      const contractPromise = fetchContractABI(contractAddress);
      contractPromise.then((data) => {
        setContractABI(data);
      });

      setCurrentParsedContractAddress(contractAddress);
    }
  }, [currentParsedContractAddress, contractAddress]);

  useEffect(() => {
    if (contractABI) {
      setUsefulMethods(extractUsefulMethods(JSON.parse(contractABI)));
    }
  }, [contractABI]);

  return {
    contractABI,
    usefulMethods,
  };
};
