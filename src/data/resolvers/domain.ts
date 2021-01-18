import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';
import { Color } from '~core/ColorTag';

// eslint-disable-next-line no-empty-pattern
export const domainResolvers = ({ ipfs }: Required<Context>): Resolvers => ({
  Domain: {
    async color({ metadata: metadataHash, metadataHistory }) {
      const lastMetadata = metadataHistory.slice(-1).pop();
      const ipfsHash = metadataHash || lastMetadata?.metadata || '';
      const metadataString = await ipfs.getString(ipfsHash as string);
      const metadata = JSON.parse(metadataString || '{}');
      return metadata?.domainColor || Color.Pink;
    },
    description: () => {
      /*
       * @TODO parse logs for description here
       */
      return null;
    },
  },
});
