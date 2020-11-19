import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';
import { Color } from '~core/ColorTag';

// eslint-disable-next-line no-empty-pattern
export const domainResolvers = ({}: Required<Context>): Resolvers => ({
  Domain: {
    color: () => {
      /*
       * @TODO parse logs for color here
       */
      return Color.Black;
    },
    description: () => {
      /*
       * @TODO parse logs for description here
       */
      return null;
    },
  },
});
