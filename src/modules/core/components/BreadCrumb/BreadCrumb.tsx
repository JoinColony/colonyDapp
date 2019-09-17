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
        <>
          {elements.length > 1 && i < elements.length - 1 ? (
            <>
              <p className={styles.breadCrumble}>
                <FormattedMessage {...Object.values(crumb)[0]} />
              </p>
              <p className={styles.arrow}>&gt;</p>
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
        </>
      ))}
    </div>
  );
};

BreadCrumb.displayName = displayName;

export default BreadCrumb;
