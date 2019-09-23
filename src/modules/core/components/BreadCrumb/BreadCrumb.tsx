import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import styles from './BreadCrumb.css';

interface Props {
  /*
   * The bread crumb elements have to get filtered to the correct
   * array of elements outside of this components and just an array
   * of strings gets passed in. The last active element gets highlighted.
   */
  elements: MessageDescriptor[];
}

const displayName = 'core.BreadCrumb';

const BreadCrumb = ({ elements }: Props) => {
  return (
    <div className={styles.crumbContainer}>
      {elements.map((crumb, i) => (
        <div className={styles.element} key={`breadCrumb_${crumb}`}>
          {elements.length > 1 && i < elements.length - 1 ? (
            <>
              <span className={styles.breadCrumble}>
                <FormattedMessage {...Object.values(crumb)[0]} />
              </span>
              <span className={styles.arrow}>&gt;</span>
            </>
          ) : null}
          <>
            {i === elements.length - 1 || elements.length === 1 ? (
              <>
                <b className={styles.breadCrumble}>
                  <FormattedMessage {...Object.values(crumb)[0]} />
                </b>
              </>
            ) : null}
          </>
        </div>
      ))}
    </div>
  );
};

BreadCrumb.displayName = displayName;

export default BreadCrumb;
