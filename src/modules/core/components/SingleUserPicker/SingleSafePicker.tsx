import { useField } from 'formik';
import React, { ComponentProps, useMemo } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import classnames from 'classnames';

import { InputStatus } from '~core/Fields';
import { GnosisSafe } from '~dashboard/Dialogs/GnosisControlSafeDialog/';
import { Safe } from '~redux/types/actions/colonyActions';
import SingleUserPicker from './SingleUserPicker';

import styles from '~dashboard/Dialogs/GnosisControlSafeDialog/GnosisControlSafeForm.css';

/* SingleSafePicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: GnosisSafe[];
}

const displayName = 'SingleUserPicker.SingleSafePicker';

const SingleSafePicker = ({ data, name, ...props }: Props) => {
  const { formatMessage } = useIntl();
  const [, { error, touched }, { setTouched }] = useField<Safe | null>(name);

  const formattedData = useMemo(
    () =>
      data.map((item) => ({
        id: item.address,
        profile: {
          displayName: `${item.name} (${item.chain})`,
          walletAddress: item.address,
        },
      })),
    [data],
  );

  return (
    <div
      className={classnames({
        [styles.invalidSafe]: touched && error,
      })}
      onBlur={() => setTouched(true)}
    >
      <SingleUserPicker
        {...props}
        name={name}
        data={formattedData}
        placholderIconName="gnosis-logo"
      />
      {/*
       * Using error.id so that when a safe is not selected, it doesn't show "required" error since this looks messy
       * when combined with the async validation.
       */}
      {touched && (error as MessageDescriptor)?.id && (
        <InputStatus error={formatMessage(error as MessageDescriptor)} />
      )}
    </div>
  );
};

SingleSafePicker.displayName = displayName;

export default SingleSafePicker;
