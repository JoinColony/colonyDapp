import React, { Fragment } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import styles from './BreadCrumb.css';

interface Props {
  /*
   * The bread crumb elements have to get filtered to the correct
   * array of elements outside of this components and just an array
   * of strings gets passed in. The last active element gets highlighted.
   */
  elements: (string | MessageDescriptor)[];
}

const displayName = 'core.BreadCrumb';

const BreadCrumb = ({ elements }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.crumbContainer}>
      {elements.map((crumb, i) => {
        const crumbText =
          typeof crumb == 'string' ? crumb : formatMessage(crumb);
        return (
          <Fragment key={`breadCrumb_${crumbText}`}>
            {elements.length > 1 && i < elements.length - 1 ? (
              <div className={styles.element} title={crumbText}>
                <span className={styles.breadCrumble}>{crumbText}</span>
                <span className={styles.arrow}>&gt;</span>
              </div>
            ) : null}
            {i === elements.length - 1 || elements.length === 1 ? (
              <div className={styles.elementLast} title={crumbText}>
                <b className={styles.breadCrumble}>{crumbText}</b>
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

BreadCrumb.displayName = displayName;

export default BreadCrumb;
