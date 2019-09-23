import React, { ReactNode, useState } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';

import { multiLineTextEllipsis } from '~utils/strings';
import styles from './ExpandedParagraph.css';

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
        <span className={styles.moreButtonContainer}>
          <Button
            onClick={() => {
              expandDescription(true);
            }}
            text={MSG.more}
            appearance={{ theme: 'blue' }}
          />
        </span>
      )}
      {expanded && (
        <>
          {expandedElements}
          <div className={styles.hideButtonContainer}>
            <Button
              onClick={() => {
                expandDescription(false);
              }}
              text={MSG.hide}
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
