import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useProgramQuery } from '~data/index';

const MSG = defineMessages({
  backText: {
    id: 'pages.ProgramBackText.backText',
    defaultMessage: `
      {title, select,
        undefined {Back to Program}
        other {Back to {title}}
      }`,
  },
});

const ProgramBackText = () => {
  const { programId } = useParams();
  const { data } = useProgramQuery({
    variables: { id: programId },
  });
  if (!data) return null;
  let { title } = data.program;
  if (!title) {
    // Set title to undefined in cases of null or empty string to catch that in formatJS' `select` statement
    title = undefined;
  }
  return <FormattedMessage {...MSG.backText} values={{ title }} />;
};

export default ProgramBackText;
