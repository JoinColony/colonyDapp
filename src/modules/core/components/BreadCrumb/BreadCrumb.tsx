import React from 'react';

import styles from './BreadCrumb.css';

interface Props {
  /*
   * The bread crumb elements have to get filtered to the correct
   * array of elements outside of this components and just an array
   * of strings gets passed in. The last active element gets highlighted.
   */
  elements: string[];
}

const BreadCrumb = ({ elements }: Props) => {
  return (
    <div className={styles.crumbContainer}>
      {elements.map((crumb, i) => (
        <>
          {elements.length > 1 && i < elements.length - 1 ? (
            <>
              <p className={styles.breadCrumble}>{crumb}</p>
              <p className={styles.arrow}>&gt;</p>
            </>
          ) : null}
          <>
            {i === elements.length - 1 || elements.length === 1 ? (
              <>
                <b className={styles.breadCrumble}>{crumb}</b>
              </>
            ) : null}
          </>
        </>
      ))}
    </div>
  );
};

export default BreadCrumb;
