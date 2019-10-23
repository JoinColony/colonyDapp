import React from 'react';
import { injectIntl, IntlShape, MessageDescriptor } from 'react-intl';

import styles from './BreadCrumb.css';

interface Props {
  /*
   * The bread crumb elements have to get filtered to the correct
   * array of elements outside of this components and just an array
   * of strings gets passed in. The last active element gets highlighted.
   */
  elements: (string | MessageDescriptor)[];
  intl: IntlShape;
}

const displayName = 'core.BreadCrumb';

const BreadCrumb = ({ elements, intl: { formatMessage } }: Props) => {
  return (
    <div className={styles.crumbContainer}>
      {elements.map((crumb, i) => {
        const crumbText =
          typeof crumb == 'string' ? crumb : formatMessage(crumb);
        return (
          <div className={styles.element} key={`breadCrumb_${crumbText}`}>
            <>
              {elements.length > 1 && i < elements.length - 1 ? (
                <>
                  <span className={styles.breadCrumble}>{crumbText}</span>
                  <span className={styles.arrow}>&gt;</span>
                </>
              ) : null}
            </>
            <>
              {i === elements.length - 1 || elements.length === 1 ? (
                <b className={styles.breadCrumble}>{crumbText}</b>
              ) : null}
            </>
          </div>
        );
      })}
    </div>
  );
};

BreadCrumb.displayName = displayName;

export default injectIntl(BreadCrumb);
