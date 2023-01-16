import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { FieldArray, useField } from 'formik';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { FormSection, InputLabel } from '~core/Fields';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import Icon from '~core/Icon';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { filterUserSelection } from '~core/SingleUserPicker';
import { supRenderAvatar } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import Button from '~core/Button';

import Radio from '../Radio';
import SingleUserPicker from '../SingleUserPicker';

import styles from './Protectors.css';

export const MSG = defineMessages({
  protectorsLabel: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.protectorsLabel`,
    defaultMessage: 'Nominate protectors <span>(max 5)</span>',
  },
  protectorsTooltip: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.protectorsTooltip`,
    defaultMessage: `A Protector's role in a DAO legal corporation is to ratify the decisions of the DAO. Their purpose is to act on behalf of the DAO and handle legal the required administration. Learn more`,
  },
  deleteIconTitle: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.deleteIconTitle`,
    defaultMessage: 'Delete recipient',
  },
  signOptionLabel: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.signOptionLabel`,
    defaultMessage: 'How documents are signed',
  },
  signOptionTooltip: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.signOptionTooltip`,
    defaultMessage: `Decide the requirements as to how many Protectors are required to sign legal documents to enact the decisions of a DAO.`,
  },
  individual: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.individual`,
    defaultMessage: 'Individual signing (security concerns)',
  },
  multiple: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.multiple`,
    defaultMessage: 'All need to sign (the risk is a stalemate)',
  },
  mainContact: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.mainContact`,
    defaultMessage: 'Main contact',
  },
  mainContactTooltip: {
    id: `dashboard.DAOIncorporation.IncorporationForm.Protectors.mainContactTooltip`,
    defaultMessage: `The main contact is required during the incorporation process and is also required to use their delivery address details for the registration.`,
  },
});

const displayName = 'dashboard.DAOIncorporation.IncorporationForm.Protectors';

export interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

export enum SignOption {
  Individual = 'individual',
  Multiple = 'multiple',
}

const Protectors = ({ colony, sidebarRef }: Props) => {
  const [, { value: protectors }] = useField<AnyUser[]>('protectors');
  const [, { value: signOption }] = useField('signOption');
  const [
    ,
    { value: mainContact, error, touched },
    { setValue: setMainContact },
  ] = useField('mainContact');
  const { formatMessage } = useIntl();

  const { data: colonyMembers, loading } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });

  const shouldShowMainContact = useMemo(() => {
    const protectorsData = protectors?.filter(
      (protector) => !isEmpty(protector),
    );
    if (!protectorsData) return false;
    if (protectorsData?.length < 2) return false;
    return true;
  }, [protectors]);

  const mainContactData = useMemo(() => {
    return protectors?.filter((protector) => !isEmpty(protector));
  }, [protectors]);

  // users are filtered to remove selected protectors from the options
  const protectorsData = useMemo(() => {
    return (colonyMembers?.subscribedUsers || []).filter(
      (item) => !protectors.includes(item),
    );
  }, [colonyMembers, protectors]);

  useEffect(() => {
    if (!protectors.includes(mainContact)) {
      setMainContact(undefined);
    }
    // didn't want to add setMainContact to dependencies array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainContact, protectors]);

  return (
    <>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.wrapper}>
          <div className={styles.protectorsLabelWrapper}>
            <div className={styles.label}>
              <FormattedMessage
                {...MSG.protectorsLabel}
                values={{
                  span: (chunks) => (
                    <span className={styles.additionalText}>{chunks}</span>
                  ),
                }}
              />
            </div>
            <QuestionMarkTooltip tooltipText={MSG.protectorsTooltip} />
          </div>
          <FieldArray
            name="protectors"
            render={({ push, remove }) => (
              <>
                {protectors?.map((protector, index) => {
                  const key =
                    protector?.id === 'filterValue'
                      ? `filterValue${index}`
                      : protector?.id;

                  return (
                    <SingleUserPicker
                      key={key || index}
                      data={protectorsData}
                      label=""
                      name={`protectors[${index}]`}
                      placeholder="Search"
                      sidebarRef={sidebarRef}
                      disabled={loading}
                      filter={filterUserSelection}
                      renderAvatar={supRenderAvatar}
                      remove={remove}
                      index={index}
                      setMainContact={setMainContact}
                    />
                  );
                })}
                {protectors && protectors?.length < 5 && (
                  <Button
                    onClick={() => {
                      push(undefined);
                    }}
                    appearance={{ theme: 'blue' }}
                  >
                    <Icon
                      name="circle-plus-2"
                      className={styles.circlePlusIcon}
                    />
                  </Button>
                )}
              </>
            )}
          />
        </div>
      </FormSection>
      {shouldShowMainContact && mainContactData && (
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.wrapper}>
            <div className={styles.labelWrapper}>
              <InputLabel label={MSG.mainContact} />
              <QuestionMarkTooltip tooltipText={MSG.mainContactTooltip} />
            </div>
            <div className={styles.mainContactWrapper}>
              <div className={styles.selectWrapper}>
                <UserPickerWithSearch
                  data={mainContactData}
                  label=""
                  name="mainContact"
                  filter={filterUserSelection}
                  renderAvatar={supRenderAvatar}
                  placeholder="Search"
                  sidebarRef={sidebarRef}
                  disabled={!protectors}
                />
                {error && typeof error === 'object' && touched && (
                  <div className={styles.error}>{formatMessage(error)}</div>
                )}
              </div>
              <Icon
                name="trash"
                className={styles.deleteIcon}
                onClick={() => setMainContact(undefined)}
                title={MSG.deleteIconTitle}
              />
            </div>
          </div>
        </FormSection>
      )}
      {shouldShowMainContact && (
        <div className={styles.signOptionWrapper}>
          <div
            className={classNames(styles.labelWrapper, styles.additionalMargin)}
          >
            <InputLabel label={MSG.signOptionLabel} />
            <QuestionMarkTooltip tooltipText={MSG.signOptionTooltip} />
          </div>
          <Radio
            checked={signOption === SignOption.Individual}
            name="signOption"
            label={MSG.individual}
            value={SignOption.Individual}
          />
          <Radio
            checked={signOption === SignOption.Multiple}
            name="signOption"
            label={MSG.individual}
            value={SignOption.Multiple}
          />
        </div>
      )}
    </>
  );
};

Protectors.displayName = displayName;

export default Protectors;
