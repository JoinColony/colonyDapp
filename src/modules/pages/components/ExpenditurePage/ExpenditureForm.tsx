import { useFormikContext } from 'formik';
import React, { useMemo } from 'react';

import { ExpenditureSettings } from '~dashboard/ExpenditurePage';
import Payments from '~dashboard/ExpenditurePage/Payments';
import Split from '~dashboard/ExpenditurePage/Split';
import { Colony } from '~data/index';

import { ValuesType } from './ExpenditurePage';
import styles from './ExpenditurePage.css';
import { ExpenditureTypes } from './types';

const MSG = defineMessages({
  submit: {
    id: 'dashboard.ExpenditureForm.submit',
    defaultMessage: 'Submit',
  },
});

interface Props {
  colony: Colony;
  sidebarRef: HTMLElement | null;
}

const ExpenditureForm = ({ sidebarRef, colony }: Props) => {
  const { values } = useFormikContext<ValuesType>() || {};

  const secondFormSection = useMemo(() => {
    const expenditureType = values.expenditure;
    switch (expenditureType) {
      case ExpenditureTypes.Advanced: {
        return <Payments sidebarRef={sidebarRef} colony={colony} />;
      }
      case ExpenditureTypes.Split: {
        return <Split />;
      }
      default:
        return null;
    }
  }, [colony, sidebarRef, values]);

  return (
    <>
      <ExpenditureSettings colony={colony} sidebarRef={sidebarRef} />
      {secondFormSection}
    </>
  );
};

export default ExpenditureForm;
