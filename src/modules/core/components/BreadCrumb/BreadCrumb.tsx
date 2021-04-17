import React, { Fragment, ReactElement, isValidElement } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import styles from './BreadCrumb.css';
import SingleCrumb from './SingleCrumb';

export type CrumbText = string | ReactElement | MessageDescriptor;
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
        let crumbText: CrumbText;
        if (Array.isArray(crumb)) {
          /*
           * It's a react element or a string, we handle both cases the same
           */
          if (isValidElement(crumb[0]) || typeof crumb[0] === 'string') {
            [crumbText] = crumb;
          } else {
            /*
             * It's a message descriptor
             */
            crumbText = formatMessage(crumb[0] as MessageDescriptor);
          }
          [, crumbLink] = crumb;
        } else {
          if (isValidElement(crumb) || typeof crumb === 'string') {
            crumbText = crumb;
          } else {
            crumbText = formatMessage(crumb);
          }
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
