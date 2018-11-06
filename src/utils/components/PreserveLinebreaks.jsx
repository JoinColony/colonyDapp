/* @flow */

import React, { Fragment, Children, isValidElement } from 'react';
import type { Node } from 'react';

// Replaces `\n` new line characters with `<br />` recursively
// eslint-disable-next-line import/prefer-default-export
export const PreserveLinebreaks = ({ children }: { children: Node }) =>
  Children.map(children, child => {
    if (!isValidElement(child)) {
      return child.split('\n').map((item, key, arr) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={key}>
          {item}
          {key !== arr.length - 1 && <br />}
        </Fragment>
      ));
    }

    if (child.props.children) {
      return <PreserveLinebreaks>{child}</PreserveLinebreaks>;
    }

    return child;
  });
