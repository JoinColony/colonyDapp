export interface ProcessEnv {
  NODE_ENV: 'development' | 'production';
  CHAIN_ID: number;
  COLONY_NETWORK_ENS_NAME: string;
  LOADER: string;
  NETWORK: string;
  PINNING_ROOM: string;
  ETHPLORER_API_KEY: string;
  INFURA_ID: string;
}
