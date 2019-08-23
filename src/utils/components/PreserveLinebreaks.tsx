import React, { Fragment, Children, isValidElement, ReactNode } from 'react';

// Replaces `\n` new line characters with `<br />` recursively
export const PreserveLinebreaks = ({ children }: { children: ReactNode }) =>
  Children.map(children, child => {
    if (!isValidElement(child)) {
      return (child as string).split('\n').map((item, key, arr) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={key}>
          {item}
          {key !== arr.length - 1 && <br />}
        </Fragment>
      ));
    }

    if ((child.props as any).children) {
      // @ts-ignore
      return <PreserveLinebreaks>{child}</PreserveLinebreaks>;
    }

    return child;
  });
