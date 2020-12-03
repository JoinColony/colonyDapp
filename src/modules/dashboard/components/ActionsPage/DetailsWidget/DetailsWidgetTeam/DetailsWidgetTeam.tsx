import React, { useEffect, useState } from 'react';
import { Address } from '~types/index';
import { useColonyDomainsQuery, Domain } from '~data/index';
import ColorTag from '~core/ColorTag';


const displayName = 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetTeam';


interface Props {
  domainId: number;
  colonyAddress: Address;
}

const DetailsWidgetTeam = ({
  domainId,
  colonyAddress
}: Props) => {
  const [team, setTeam] = useState<Domain>();

  const { data } = useColonyDomainsQuery({
    variables: { colonyAddress: colonyAddress || '' },
  });

  useEffect(() => {
    if (data) {
      const domain = data.colony.domains.find(
        ({ ethDomainId }) => Number(domainId) === ethDomainId,
      );
      console.log(data.colony.domains)
      if (domain) {
        setTeam(domain);
      }
    }
  }, [data, domainId]);

  return (
    <>
      {team && (
        <div>
          {team.color && (
            <ColorTag color={team.color} />
          )}
          {` ${team.name}`}
        </div>
      )}
    </>
  );
};

DetailsWidgetTeam.displayName = displayName;

export default DetailsWidgetTeam;
