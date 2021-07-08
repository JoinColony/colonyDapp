import React from 'react';
import { defineMessage } from 'react-intl';

import { useWhitelistedUsersQuery } from '~data/index';
import { MiniSpinnerLoader } from '~core/Preloaders';

import Button from '~core/Button';

import { useDialog } from '~core/Dialog';

import AgreementDialog from './AgreementDialog';
import styles from './WhitelistExtension.css';
import UploadAddressesWidget from './UploadAddressesWidget';
import WhitelistAddresses from './WhitelistAddresses';

export interface Props {
  colonyAddress: string;
}

const MSG = defineMessage({
  loadingText: {
    id: 'dashboard.Whitelist.loadingText',
    defaultMessage: 'Loading whitelist',
  },
  agreement: {
    id: 'dashboard.Extensions.WhitelisExtension.agreement',
    defaultMessage: 'Agreement',
  },
});

const Whitelist = ({ colonyAddress }: Props) => {
  const openAgreementDialog = useDialog(AgreementDialog);

  const { data, loading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
  });
  return (
    <div>
      <UploadAddressesWidget />
      {loading && <MiniSpinnerLoader loadingText={MSG.loadingText} />}
      {(data?.whitelistedUsers?.length && (
        <WhitelistAddresses
          colonyAddress={colonyAddress}
          users={data.whitelistedUsers}
        />
      )) ||
        null}
      <div className={styles.buttonsContainer}>
        <Button
          appearance={{ theme: 'blue' }}
          onClick={openAgreementDialog}
          text={MSG.agreement}
        />
        <Button
          appearance={{ theme: 'primary' }}
          text={{ id: 'button.confirm' }}
          // temporary (outside of the scope of the issue)
          disabled
        />
      </div>
    </div>
  );
};

export default Whitelist;
