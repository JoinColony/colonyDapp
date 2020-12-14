import React from 'react';
import { OneDomain } from '~data/index';
import ColorTag from '~core/ColorTag';

const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetTeam';

interface Props {
  domain: OneDomain;
}

const DetailsWidgetTeam = ({ domain }: Props) => (
  <div>
    {domain.color && <ColorTag color={domain.color} />}
    {` ${domain?.name}`}
  </div>
);

DetailsWidgetTeam.displayName = displayName;

export default DetailsWidgetTeam;
