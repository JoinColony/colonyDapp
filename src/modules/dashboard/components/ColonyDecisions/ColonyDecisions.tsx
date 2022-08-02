import React from 'react';

import { Colony } from '~data/index';

type Props = {
  colony: Colony;
  /*
   * @NOTE Needed for filtering based on domain
   */
  ethDomainId?: number;
};

/* Temporary disable */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ColonyDecisions = ({ colony }: Props) => {
  return <div>DECISIONS</div>;
};

export default ColonyDecisions;
