import { Form, useFormikContext } from 'formik';
import React, { useCallback, useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import StakeExpenditureDialog from '~dashboard/Dialogs/StakeExpenditureDialog';
import { ExpenditureSettings } from '~dashboard/ExpenditurePage';
import Payments from '~dashboard/ExpenditurePage/Payments';
import Split from '~dashboard/ExpenditurePage/Split';
import Staged from '~dashboard/ExpenditurePage/Staged';
import { Colony } from '~data/index';
import Streaming from '~dashboard/ExpenditurePage/Streaming';
import { LOCAL_STORAGE_EXPENDITURE_TYPE_KEY } from '~constants';

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
  const { values, handleSubmit, validateForm } =
    useFormikContext<ValuesType>() || {};

  const expenditureType = values.expenditure;

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_EXPENDITURE_TYPE_KEY, expenditureType);
  }, [expenditureType]);

  const openDraftConfirmDialog = useDialog(StakeExpenditureDialog);

  const onSubmit = useCallback(
    // eslint-disable-next-line consistent-return
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const errors = await validateForm(values);
      const hasErrors = Object.keys(errors)?.length;

      return (
        !hasErrors &&
        openDraftConfirmDialog({
          onClick: () => {
            handleSubmit(values as any);
          },
          isVotingExtensionEnabled: true,
          colony,
        })
      );
    },
    [colony, handleSubmit, openDraftConfirmDialog, validateForm, values],
  );

  const secondFormSection = useMemo(() => {
    switch (expenditureType) {
      case ExpenditureTypes.Advanced: {
        return <Payments sidebarRef={sidebarRef} colony={colony} />;
      }
      case ExpenditureTypes.Staged: {
        return <Staged colony={colony} sidebarRef={sidebarRef} />;
      }
      case ExpenditureTypes.Split: {
        return <Split sidebarRef={sidebarRef} colony={colony} />;
      }
      case ExpenditureTypes.Streaming: {
        return <Streaming sidebarRef={sidebarRef} colony={colony} />;
      }
      default:
        return null;
    }
  }, [colony, expenditureType, sidebarRef]);

  return (
    <Form onSubmit={onSubmit}>
      <ExpenditureSettings {...{ sidebarRef, colony }} />
      {secondFormSection}
      <button type="submit" tabIndex={-1} className={styles.hiddenSubmit}>
        <FormattedMessage {...MSG.submit} />
      </button>
    </Form>
  );
};

export default ExpenditureForm;
