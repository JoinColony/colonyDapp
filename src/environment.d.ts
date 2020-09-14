// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    COLONY_NETWORK_ENS_NAME: string;
    NETWORK: string;
    PINNING_ROOM: string;
    INFURA_ID: string;
    VERSION: string;
  }
}
