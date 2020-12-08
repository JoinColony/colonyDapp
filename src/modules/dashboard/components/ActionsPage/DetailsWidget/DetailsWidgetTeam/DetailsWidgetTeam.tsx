import React, { useEffect, useState } from 'react';
import { Address } from '~types/index';
import { useColonyDomainsQuery, OneDomain } from '~data/index';
import ColorTag from '~core/ColorTag';

const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetTeam';

interface Props {
  domainId: number;
  colonyAddress: Address;
}

const DetailsWidgetTeam = ({ domainId, colonyAddress }: Props) => {
  const [team, setTeam] = useState<OneDomain | undefined>();

  const { data } = useColonyDomainsQuery({
    variables: { colonyAddress: colonyAddress || '' },
  });

  useEffect(() => {
    if (data) {
      const domain = data.colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      if (domain) {
        setTeam(domain);
      }
    }
  }, [data, domainId]);

  return (
    <>
      {team && team.name && (
        <div>
          {team.color && <ColorTag color={team.color} />}
          {` ${team?.name}`}
        </div>
      )}
    </>
  );
};

DetailsWidgetTeam.displayName = displayName;

export default DetailsWidgetTeam;
