import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyFromNameQuery } from '~data/index';

const MSG = defineMessages({
  backText: {
    id: 'pages.ColonyBackText.backText',
    defaultMessage: `
      {displayName, select,
        undefined {Back to Colony}
        other {Back to {displayName}}
      }`,
  },
});

const ColonyBackText = () => {
  const { colonyName } = useParams();
  const { data } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    variables: { name: colonyName, address: '' },
  });
  if (!data) return null;
  const { displayName = colonyName } = data.colony;
  return <FormattedMessage {...MSG.backText} values={{ displayName }} />;
};

export default ColonyBackText;
