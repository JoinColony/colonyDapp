// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    COLONY_NETWORK_ENS_NAME: string;
    LOADER: string;
    NETWORK: string;
    PINNING_ROOM: string;
    ETHPLORER_API_KEY: string;
    INFURA_ID: string;
    VERSION: string;
  }
}
