import { useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ExpenditureSettings } from '~dashboard/ExpenditurePage';
import Payments from '~dashboard/ExpenditurePage/Payments';
import Split from '~dashboard/ExpenditurePage/Split';
import { Colony } from '~data/index';

import { ValuesType, ExpenditureTypes } from './types';
import styles from './ExpenditurePage.css';

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
        return <Split sidebarRef={sidebarRef} colony={colony} />;
      }
      default:
        return null;
    }
  }, [colony, sidebarRef, values]);

  return (
    <>
      <ExpenditureSettings colony={colony} sidebarRef={sidebarRef} />
      {secondFormSection}
      <button type="submit" tabIndex={-1} className={styles.hiddenSubmit}>
        <FormattedMessage {...MSG.submit} />
      </button>
    </>
  );
};

export default ExpenditureForm;
