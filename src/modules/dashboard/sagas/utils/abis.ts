// Temp file. Will be deleted once abi added to ColonyJs
import { AbiItem } from 'web3-utils';

export const ForeignAMB: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: 'transactionHash',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_txHash',
        type: 'bytes32',
      },
    ],
    name: 'relayedMessages',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_sourceChainId',
        type: 'uint256',
      },
      {
        name: '_destinationChainId',
        type: 'uint256',
      },
      {
        name: '_validatorContract',
        type: 'address',
      },
      {
        name: '_maxGasPerTx',
        type: 'uint256',
      },
      {
        name: '_gasPrice',
        type: 'uint256',
      },
      {
        name: '_requiredBlockConfirmations',
        type: 'uint256',
      },
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isInitialized',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'requiredBlockConfirmations',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_signatures',
        type: 'bytes',
      },
    ],
    name: 'executeSignatures',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_signatures',
        type: 'bytes',
      },
    ],
    name: 'safeExecuteSignaturesWithAutoGasLimit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'getMinimumGasUsage',
    outputs: [
      {
        name: 'gas',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'failedMessageReceiver',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getBridgeMode',
    outputs: [
      {
        name: '_data',
        type: 'bytes4',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_sourceChainId',
        type: 'uint256',
      },
      {
        name: '_destinationChainId',
        type: 'uint256',
      },
    ],
    name: 'setChainIds',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'failedMessageSender',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'messageId',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
    ],
    name: 'claimTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_maxGasPerTx',
        type: 'uint256',
      },
    ],
    name: 'setMaxGasPerTx',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'requiredSignatures',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'validatorContract',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'deployedAtBlock',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getBridgeInterfacesVersion',
    outputs: [
      {
        name: 'major',
        type: 'uint64',
      },
      {
        name: 'minor',
        type: 'uint64',
      },
      {
        name: 'patch',
        type: 'uint64',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'messageSourceChainId',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_blockConfirmations',
        type: 'uint256',
      },
    ],
    name: 'setRequiredBlockConfirmations',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_gasPrice',
        type: 'uint256',
      },
    ],
    name: 'setGasPrice',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'messageCallStatus',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'messageSender',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_contract',
        type: 'address',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_gas',
        type: 'uint256',
      },
    ],
    name: 'requireToPassMessage',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'failedMessageDataHash',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'maxGasPerTx',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'gasPrice',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'messageId',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: 'encodedData',
        type: 'bytes',
      },
    ],
    name: 'UserRequestForAffirmation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        name: 'executor',
        type: 'address',
      },
      {
        indexed: true,
        name: 'messageId',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: 'status',
        type: 'bool',
      },
    ],
    name: 'RelayedMessage',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'gasPrice',
        type: 'uint256',
      },
    ],
    name: 'GasPriceChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'requiredBlockConfirmations',
        type: 'uint256',
      },
    ],
    name: 'RequiredBlockConfirmationChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: false,
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
];

export const HomeAMB: AbiItem[] = [
  {
    constant: true,
    inputs: [],
    name: 'transactionHash',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_message',
        type: 'bytes32',
      },
    ],
    name: 'numMessagesSigned',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_hash',
        type: 'bytes32',
      },
      {
        name: '_index',
        type: 'uint256',
      },
    ],
    name: 'signature',
    outputs: [
      {
        name: '',
        type: 'bytes',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_sourceChainId',
        type: 'uint256',
      },
      {
        name: '_destinationChainId',
        type: 'uint256',
      },
      {
        name: '_validatorContract',
        type: 'address',
      },
      {
        name: '_maxGasPerTx',
        type: 'uint256',
      },
      {
        name: '_gasPrice',
        type: 'uint256',
      },
      {
        name: '_requiredBlockConfirmations',
        type: 'uint256',
      },
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isInitialized',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'requiredBlockConfirmations',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'getMinimumGasUsage',
    outputs: [
      {
        name: 'gas',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'failedMessageReceiver',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getBridgeMode',
    outputs: [
      {
        name: '_data',
        type: 'bytes4',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_sourceChainId',
        type: 'uint256',
      },
      {
        name: '_destinationChainId',
        type: 'uint256',
      },
    ],
    name: 'setChainIds',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'message',
    outputs: [
      {
        name: '',
        type: 'bytes',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'failedMessageSender',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'signature',
        type: 'bytes',
      },
      {
        name: 'message',
        type: 'bytes',
      },
    ],
    name: 'submitSignature',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'messageId',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_token',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
    ],
    name: 'claimTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'numAffirmationsSigned',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_hash',
        type: 'bytes32',
      },
    ],
    name: 'affirmationsSigned',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_maxGasPerTx',
        type: 'uint256',
      },
    ],
    name: 'setMaxGasPerTx',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'requiredSignatures',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_message',
        type: 'bytes32',
      },
    ],
    name: 'messagesSigned',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'validatorContract',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'deployedAtBlock',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getBridgeInterfacesVersion',
    outputs: [
      {
        name: 'major',
        type: 'uint64',
      },
      {
        name: 'minor',
        type: 'uint64',
      },
      {
        name: 'patch',
        type: 'uint64',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'messageSourceChainId',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_blockConfirmations',
        type: 'uint256',
      },
    ],
    name: 'setRequiredBlockConfirmations',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_gasPrice',
        type: 'uint256',
      },
    ],
    name: 'setGasPrice',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'messageCallStatus',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'messageSender',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_contract',
        type: 'address',
      },
      {
        name: '_data',
        type: 'bytes',
      },
      {
        name: '_gas',
        type: 'uint256',
      },
    ],
    name: 'requireToPassMessage',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_messageId',
        type: 'bytes32',
      },
    ],
    name: 'failedMessageDataHash',
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'maxGasPerTx',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'message',
        type: 'bytes',
      },
    ],
    name: 'executeAffirmation',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'gasPrice',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_number',
        type: 'uint256',
      },
    ],
    name: 'isAlreadyProcessed',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'messageId',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: 'encodedData',
        type: 'bytes',
      },
    ],
    name: 'UserRequestForSignature',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        name: 'executor',
        type: 'address',
      },
      {
        indexed: true,
        name: 'messageId',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: 'status',
        type: 'bool',
      },
    ],
    name: 'AffirmationCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'signer',
        type: 'address',
      },
      {
        indexed: false,
        name: 'messageHash',
        type: 'bytes32',
      },
    ],
    name: 'SignedForUserRequest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'signer',
        type: 'address',
      },
      {
        indexed: false,
        name: 'messageHash',
        type: 'bytes32',
      },
    ],
    name: 'SignedForAffirmation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'authorityResponsibleForRelay',
        type: 'address',
      },
      {
        indexed: false,
        name: 'messageHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        name: 'NumberOfCollectedSignatures',
        type: 'uint256',
      },
    ],
    name: 'CollectedSignatures',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'gasPrice',
        type: 'uint256',
      },
    ],
    name: 'GasPriceChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'requiredBlockConfirmations',
        type: 'uint256',
      },
    ],
    name: 'RequiredBlockConfirmationChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: false,
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
];

export const erc721 = {
  default: {
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: '_approved',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: '_operator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: '_approved',
            type: 'bool',
          },
        ],
        name: 'ApprovalForAll',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: '_from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_approved',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'getApproved',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_operator',
            type: 'address',
          },
        ],
        name: 'isApprovedForAll',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'ownerOf',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_operator',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: '_approved',
            type: 'bool',
          },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes4',
            name: 'interfaceID',
            type: 'bytes4',
          },
        ],
        name: 'supportsInterface',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_tokenId',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
  },
};
