import React, { ReactNode, useState } from 'react';
import { defineMessages, MessageDescriptor, MessageValues } from 'react-intl';

import Button from '~core/Button';

import { multiLineTextEllipsis } from '~utils/strings';
import styles from './ExpandedParagraph.css';

const MSG = defineMessages({
  expandText: {
    id: 'core.ExpandedParagraph.expandText',
    defaultMessage: 'Show more',
  },
  contractText: {
    id: 'core.ExpandedParagraph.contractText',
    defaultMessage: 'Show less',
  },
});

interface Props {
  /** A string or a `messageDescriptor` that makes up the "show more" control */
  expandText?: MessageDescriptor | string;
  /** Message descriptor Values for the "show more" control text (react-intl interpolation) */
  expandTextValues?: MessageValues;
  /** A string or a `messageDescriptor` that makes up the "show less" control */
  contractText?: MessageDescriptor | string;
  /** Message descriptor Values for the "show less" control text (react-intl interpolation) */
  contractTextValues?: MessageValues;
  /*
   * This contains a long text paragraph that initially gets shown
   * in a shortened version that can be extended clicking a more button
   */
  paragraph: string;
  /*
   * In case the developer wants to add further nodes to the shortened
   * version of the paragraph, this is the place to do it.
   */
  elements?: ReactNode;
  /*
   * This is to add react nodes to the extended version of the
   * paragraph.
   */
  expandedElements?: ReactNode;
  /*
   * This is the number of characters that the shortened version of the
   * paragraph will have.
   */
  characterLimit: number;
  /*
   * This is the number of characters that the extended version of the
   * paragraph will have.
   */
  maximumCharacters: number;
}

const displayName = 'core.ExpandedParagraph';

const ExpandedParagraph = ({
  expandText = MSG.expandText,
  expandTextValues,
  contractText = MSG.contractText,
  contractTextValues,
  paragraph,
  elements,
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
      {elements && elements}
      {!expanded && (
        <div className={styles.controlContainer}>
          <Button
            onClick={() => {
              expandDescription(true);
            }}
            text={expandText}
            textValues={expandTextValues}
            appearance={{ theme: 'blue' }}
          />
        </div>
      )}
      {expanded && (
        <>
          {expandedElements}
          <div className={styles.controlContainer}>
            <Button
              onClick={() => {
                expandDescription(false);
              }}
              text={contractText}
              textValues={contractTextValues}
              appearance={{ theme: 'blue' }}
            />
          </div>
        </>
      )}
    </>
  );
};

ExpandedParagraph.displayName = displayName;

export default ExpandedParagraph;
