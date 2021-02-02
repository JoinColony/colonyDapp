import React from 'react';
import { OneDomain } from '~data/index';
import ColorTag, { Color } from '~core/ColorTag';

import styles from './DetailsWidgetTeam.css';

const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetTeam';

interface Props {
  domain: OneDomain;
}

const DetailsWidgetTeam = ({ domain }: Props) => (
  <div>
    <ColorTag color={domain?.color || Color.LightPink} />
    <span className={styles.text}>{` ${domain?.name}`}</span>
  </div>
);

DetailsWidgetTeam.displayName = displayName;

export default DetailsWidgetTeam;
