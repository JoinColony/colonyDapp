import React, { Fragment } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import styles from './BreadCrumb.css';
import SingleCrumb from './SingleCrumb';

type CrumbText = string | MessageDescriptor;
export type Crumb = CrumbText | [CrumbText, string];

interface Props {
  /** BreadCrumb hierarchy. Last element will be bold text */
  elements: Crumb[];
}

const displayName = 'core.BreadCrumb';

const BreadCrumb = ({ elements }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.main}>
      {elements.map((crumb, i) => {
        let crumbLink: string;
        let crumbText: string;
        if (Array.isArray(crumb)) {
          crumbText =
            typeof crumb[0] == 'string' ? crumb[0] : formatMessage(crumb[0]);
          [, crumbLink] = crumb;
        } else {
          crumbText = typeof crumb == 'string' ? crumb : formatMessage(crumb);
          crumbLink = '';
        }
        return (
          <Fragment key={`breadCrumb_${crumbText}`}>
            {elements.length > 1 && i < elements.length - 1 ? (
              <SingleCrumb crumbText={crumbText} crumbLink={crumbLink} />
            ) : null}
            {i === elements.length - 1 || elements.length === 1 ? (
              <SingleCrumb
                crumbText={crumbText}
                crumbLink={crumbLink}
                lastCrumb
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

BreadCrumb.displayName = displayName;

export default BreadCrumb;
