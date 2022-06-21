import { log } from '~utils/debug';

import PinataCache from './PinataCache';

import {
  PINATA_API_KEY,
  PINATA_API_SECRET,
  PINATA_ENDPOINT,
  JSON_MIME_TYPE,
} from './constants';

class Pinata {
  hasApiAccess: boolean;

  cache: PinataCache = new PinataCache();

  constructor() {
    this.hasApiAccess = !!(PINATA_API_KEY && PINATA_API_SECRET);
  }

  /**
   * Return a JSON string from IPFS using the Pinata.cloud gateway
   */
  async getJSON(hash: string): Promise<string | null> {
    let responseData: string | undefined;
    try {
      if (!hash) {
        throw new Error(`IPFS hash was not provided: ${hash}`);
      }
      const response = await this.cache.getCacheObject(hash);
      responseData = await response?.text();
      if (!responseData || typeof responseData !== 'string') {
        throw new Error(`Malformed IPFS data fetched: ${responseData}`);
      }
      return responseData;
    } catch (error) {
      log.verbose('Could not get IPFS hash from Pinata Gateway:', hash);
      log.verbose(error);
      return null;
    }
  }

  /**
   * Return a JSON string to IPFS using the Pinata.cloud API
   */
  async addJSON(data: string): Promise<string | null> {
    let responseData: string | undefined;
    const potentialJSONBlob: any =
      typeof data !== 'string' ? JSON.stringify(data) : data;

    try {
      if (!this.hasApiAccess) {
        throw new Error('Client does not have the correct Pinata API keys');
      }
      /*
       * Try our best to validate the JSON file
       */
      try {
        JSON.parse(potentialJSONBlob);
      } catch (error) {
        throw new Error(`Malformed JSON data supplied: ${potentialJSONBlob}`);
      }
      const response = await fetch(`${PINATA_ENDPOINT}/pinJSONToIPFS`, {
        method: 'POST',
        /*
         * @NOTE This is because Pinata.cloud makes us supply their non-standard headers
         */
        // @ts-ignore
        headers: {
          // eslint-disable-next-line camelcase
          pinata_api_key: PINATA_API_KEY,
          // eslint-disable-next-line camelcase
          pinata_secret_api_key: PINATA_API_SECRET,
          'Content-Type': JSON_MIME_TYPE,
        },
        body: potentialJSONBlob,
      });

      let postResponse;
      try {
        postResponse = await response.json();
      } catch (error) {
        throw new Error(`POST response from Pinata failed: ${postResponse}`);
      }

      responseData = postResponse?.IpfsHash;
      if (!responseData) {
        throw new Error(
          `Failed upload the data to IPFS using Pinata API: ${JSON.stringify(
            postResponse,
          )}`,
        );
      }
      await this.cache.setCacheObject(responseData, response);
      return responseData;
    } catch (error) {
      log.verbose('Could not save data to IPFS using Pinata API:', data);
      log.verbose(error);
      return null;
    }
  }
}

export default Pinata;
