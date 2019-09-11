import React, { ReactNode, useState } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';

import { multiLineTextEllipsis } from '~utils/strings';

const MSG = defineMessages({
  more: {
    id: 'core.ExpandedParagraph.more',
    defaultMessage: 'More',
  },
  hide: {
    id: 'core.ExpandedParagraph.hide',
    defaultMessage: 'Hide',
  },
});

interface Props {
  paragraph: string;
  elements?: ReactNode;
  expandedElements?: ReactNode;
  characterLimit: number;
  maximumCharacters: number;
}

const ExpandedParagraph = ({
  paragraph,
  expandedElements,
  characterLimit,
  maximumCharacters,
}: Props) => {
  const [expanded, expandDescription] = useState(false);
  return (
    <>
      {multiLineTextEllipsis(
        paragraph,
        expanded ? maximumCharacters : characterLimit,
      )}
      {!expanded && (
        <Button
          onClick={() => {
            expandDescription(true);
          }}
          text={MSG.more}
          appearance={{ theme: 'blue' }}
        />
      )}
      {expanded && (
        <>
          {expandedElements}
          <Button
            onClick={() => {
              expandDescription(false);
            }}
            text={MSG.hide}
            appearance={{ theme: 'blue' }}
          />
        </>
      )}
    </>
  );
};

export default ExpandedParagraph;
