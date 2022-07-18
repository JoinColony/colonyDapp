import { Form, useFormikContext } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import StakeExpenditureDialog from '~dashboard/Dialogs/StakeExpenditureDialog';
import { ExpenditureSettings } from '~dashboard/ExpenditurePage';
import Payments from '~dashboard/ExpenditurePage/Payments';
import Split from '~dashboard/ExpenditurePage/Split';
import { Colony } from '~data/index';
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

const hasExpenditureKey = (obj: any): obj is { expenditure: string } => {
  return Object.prototype.hasOwnProperty.call(obj, 'expenditure');
};

const ExpenditureForm = ({ sidebarRef, colony }: Props) => {
  const { values, handleSubmit, validateForm } = useFormikContext() || {};
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
        })
      );
    },
    [handleSubmit, openDraftConfirmDialog, validateForm, values],
  );

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
    <Form onSubmit={onSubmit}>
      <ExpenditureSettings colony={colony} />
      {secondFormSection}
      <button type="submit" tabIndex={-1} className={styles.hiddenSubmit}>
        <FormattedMessage {...MSG.submit} />
      </button>
    </Form>
  );
};

export default ExpenditureForm;
