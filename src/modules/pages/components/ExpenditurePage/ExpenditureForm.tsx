import { useFormikContext } from 'formik';
import React, { useMemo } from 'react';

import { ExpenditureSettings } from '~dashboard/ExpenditurePage';
import Payments from '~dashboard/ExpenditurePage/Payments';
import Split from '~dashboard/ExpenditurePage/Split';
import { Colony } from '~data/index';
import { ValuesType } from './ExpenditurePage';

interface Props {
  colony: Colony;
  sidebarRef: HTMLElement | null;
}

const ExpenditureForm = ({ sidebarRef, colony }: Props) => {
  const { values } = useFormikContext<ValuesType>() || {};

  const secondFormSection = useMemo(() => {
    const expenditureType = values.expenditure;
    switch (expenditureType) {
      case 'advanced': {
        return <Payments {...{ colony, sidebarRef }} />;
      }
      case 'split': {
        return <Split {...{ colony, sidebarRef }} />;
      }
      default:
        return null;
    }
  }, [colony, sidebarRef, values]);

  return (
    <>
      <ExpenditureSettings colony={colony} />
      {secondFormSection}
    </>
  );
};

export default ExpenditureForm;
