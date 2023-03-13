import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldArray, useField } from 'formik';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { nanoid } from 'nanoid';

import { FormSection, InputLabel, Radio } from '~core/Fields';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import { AnyUser, Colony, useMembersSubscription } from '~data/index';
import Icon from '~core/Icon';
import UserPickerWithSearch from '~core/UserPickerWithSearch';
import { filterUserSelection } from '~core/SingleUserPicker';
import { supRenderAvatar } from '~dashboard/ExpenditurePage/Recipient/Recipient';
import { Protector } from '~pages/IncorporationPage/types';
import Button from '~core/Button';
import Link from '~core/Link';

import SingleUserPicker from '../SingleUserPicker';
import { SignOption } from '../constants';

import styles from './Protectors.css';

export const MSG = defineMessages({
  protectorsLabel: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.protectorsLabel`,
    defaultMessage: 'Nominate protectors <span>(max 5)</span>',
  },
  protectorsTooltip: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.protectorsTooltip`,
    defaultMessage: `A Protector's role in a DAO legal corporation is to ratify the decisions of the DAO. Their purpose is to act on behalf of the DAO for legal matters and any required legal administration. <a>Learn more.</a>`,
  },
  deleteIconTitle: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.deleteIconTitle`,
    defaultMessage: 'Delete recipient',
  },
  signOptionLabel: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.signOptionLabel`,
    defaultMessage: 'How documents are signed',
  },
  signOptionTooltip: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.signOptionTooltip`,
    defaultMessage: `Decide the requirements as to how many Protectors are required to sign legal documents to enact the decisions of a DAO.`,
  },
  individual: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.individual`,
    defaultMessage: 'Individual signing (security concerns)',
  },
  multiple: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.multiple`,
    defaultMessage: 'All need to sign (the risk is a stalemate)',
  },
  mainContact: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.mainContact`,
    defaultMessage: 'Main contact',
  },
  mainContactTooltip: {
    id: `dashboard.Incorporation.IncorporationForm.Protectors.mainContactTooltip`,
    defaultMessage: `The main contact is required during the incorporation process for administration purposes.`,
  },
});

const displayName = 'dashboard.Incorporation.IncorporationForm.Protectors';

export interface Props {
  sidebarRef: HTMLElement | null;
  colony: Colony;
}

const Protectors = ({ colony, sidebarRef }: Props) => {
  const [, { value: protectors }] = useField<Protector[]>('protectors');
  const [, { value: signOption }] = useField<SignOption>('signOption');
  const [, { value: mainContact }, { setValue: setMainContact }] = useField(
    'mainContact',
  );

  const { data: colonyMembers, loading } = useMembersSubscription({
    variables: { colonyAddress: colony.colonyAddress || '' },
  });

  const shouldShowMainContact = useMemo(() => {
    const protectorsData = protectors?.filter(
      (protector) => !isEmpty(protector?.user),
    );
    if (protectorsData?.length < 2) return false;
    return true;
  }, [protectors]);

  const mainContactData = useMemo(() => {
    return protectors
      ?.map((item) => item?.user)
      .filter((protector) => !isEmpty(protector));
  }, [protectors]);

  // users are filtered to remove selected protectors from the options
  const protectorsData = useMemo(() => {
    return (colonyMembers?.subscribedUsers || []).filter(
      (item) =>
        !protectors.some(
          (protector) =>
            item.id === protector.user?.id &&
            item.profile.walletAddress === protector.user.profile.walletAddress,
        ),
    );
  }, [colonyMembers, protectors]);

  const onSelected = useCallback(
    (value: AnyUser) => {
      if (!mainContact) {
        setMainContact(value);
      }
    },
    // didn't want to add setMainContact to the dependencies array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mainContact],
  );

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
            <QuestionMarkTooltip
              tooltipText={MSG.protectorsTooltip}
              tooltipTextValues={{
                a: (chunks) => <Link to="/">{chunks}</Link>, // link is a mock, add redirection to the correct page
              }}
              interactive
            />
          </div>
          <FieldArray
            name="protectors"
            render={({ push, remove }) => (
              <>
                {protectors?.map((protector, index) => (
                  <SingleUserPicker
                    key={protector.key}
                    data={protectorsData}
                    label=""
                    name={`protectors[${index}].user`}
                    placeholder="Search"
                    sidebarRef={sidebarRef}
                    disabled={loading}
                    filter={filterUserSelection}
                    renderAvatar={supRenderAvatar}
                    remove={remove}
                    index={index}
                    setMainContact={setMainContact}
                    onSelected={onSelected}
                  />
                ))}
                {protectors && protectors?.length < 5 && (
                  <Button
                    onClick={() => {
                      push({ key: nanoid(), user: undefined });
                    }}
                    appearance={{ theme: 'blue' }}
                  >
                    <Icon
                      name="circle-plus"
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
              <div>
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
          <div
            className={classNames(styles.radioWrapper, {
              [styles.selected]: signOption === SignOption.Individual,
            })}
          >
            <Radio
              checked={signOption === SignOption.Individual}
              name="signOption"
              value={SignOption.Individual}
              elementOnly
            >
              <FormattedMessage {...MSG.individual} />
            </Radio>
          </div>
          <div
            className={classNames(styles.radioWrapper, {
              [styles.selected]: signOption === SignOption.Multiple,
            })}
          >
            <Radio
              checked={signOption === SignOption.Multiple}
              name="signOption"
              value={SignOption.Multiple}
              elementOnly
            >
              <FormattedMessage {...MSG.multiple} />
            </Radio>
          </div>
        </div>
      )}
    </>
  );
};

Protectors.displayName = displayName;

export default Protectors;
