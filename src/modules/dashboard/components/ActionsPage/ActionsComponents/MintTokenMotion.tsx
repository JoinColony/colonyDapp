import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  Colony,
} from '~data/index';

const MSG = defineMessages({

});

const displayName = 'dashboard.ActionsPage.MintTokenMotion';

interface Props {
  colony: Colony;
}

const MintTokenMotion = ({}: Props) => {
  return (
    <div></div>
  );
};

MintTokenMotion.displayName = displayName;

export default MintTokenMotion;
