import React from 'react';
import { OneDomain } from '~data/index';
import ColorTag, { Color } from '~core/ColorTag';

const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetTeam';

interface Props {
  domain: OneDomain;
}

const DetailsWidgetTeam = ({ domain }: Props) => (
  <div>
    <ColorTag color={domain?.color || Color.LightPink} />
    {` ${domain?.name}`}
  </div>
);

DetailsWidgetTeam.displayName = displayName;

export default DetailsWidgetTeam;
