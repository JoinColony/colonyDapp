import { useFormikContext } from 'formik';
import React, { useMemo } from 'react';

import { ExpenditureSettings } from '~dashboard/ExpenditurePage';
import Payments from '~dashboard/ExpenditurePage/Payments';
import Split from '~dashboard/ExpenditurePage/Split';
import { Colony } from '~data/index';

interface Props {
  colony: Colony;
  sidebarRef: HTMLElement | null;
}

const hasExpenditureKey = (obj: any): obj is { expenditure: string } => {
  return Object.prototype.hasOwnProperty.call(obj, 'expenditure');
};

const ExpenditureForm = ({ sidebarRef, colony }: Props) => {
  const { values } = useFormikContext() || {};

  const secondFormSection = useMemo(() => {
    if (hasExpenditureKey(values)) {
      const expenditureType = values.expenditure;
      switch (expenditureType) {
        case 'advanced': {
          return <Payments sidebarRef={sidebarRef} colony={colony} />;
        }
        case 'split': {
          return <Split />;
        }
        default:
          return null;
      }
    }
    return null;
  }, [colony, sidebarRef, values]);

  return (
    <>
      <ExpenditureSettings colony={colony} />
      {secondFormSection}
    </>
  );
};

export default ExpenditureForm;
