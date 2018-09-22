/* @flow */
import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import { defineMessages } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import Link from '~core/Link';

const MSG = defineMessages({
  helpLinkText: {
    id: 'LoadingTemplate.helpLinkText',
    defaultMessage: 'Help',
  },
});

type Props = {
  children?: Node,
  loadingText?: string | MessageDescriptor,
};

const LoadingTemplate = ({ children, loadingText }: Props) => (
  <div>
    <header>
      <Link to="/" text={MSG.helpLinkText} />
    </header>
    <main>
      <SpinnerLoader loadingText={loadingText} />
      {children}
    </main>
  </div>
);

export default LoadingTemplate;
