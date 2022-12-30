import React, { useCallback, useRef, useState } from 'react';
import { RouteChildrenProps, useParams } from 'react-router';
import { Formik } from 'formik';

import { useColonyFromNameQuery } from '~data/generated';
import { getMainClasses } from '~utils/css';
import { SpinnerLoader } from '~core/Preloaders';
import IncorporationForm from '~dashboard/DAOIncorporation/IncorporationForm';
import DescriptionForm from '~dashboard/DAOIncorporation/DescriptionForm';

import { initialValues, validationSchema } from './constants';
import styles from './IncorporationPage.css';

const displayName = 'pages.IncorporationPage';

export type InitialValuesType = typeof initialValues;

type Props = RouteChildrenProps<{ colonyName: string }>;

const IncorporationPage = ({ match }: Props) => {
  if (!match) {
    throw new Error(
      `No match found for route in ${displayName} Please check route setup.`,
    );
  }

  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const [shouldValidate, setShouldValidate] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleValidate = useCallback(() => {
    if (!shouldValidate) {
      setShouldValidate(true);
    }
  }, [shouldValidate]);

  const { data: colonyData, loading } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validationSchema={validationSchema}
      validateOnBlur={shouldValidate}
      validateOnChange={shouldValidate}
      validate={handleValidate}
      enableReinitialize
    >
      {() => (
        <div className={getMainClasses({}, styles)} id="expenditurePage">
          <aside className={styles.sidebar} ref={sidebarRef}>
            {loading ? (
              <div className={styles.spinnerContainer}>
                <SpinnerLoader appearance={{ size: 'medium' }} />
              </div>
            ) : (
              colonyData && (
                <IncorporationForm
                  sidebarRef={sidebarRef.current}
                  colony={colonyData.processedColony}
                />
              )
            )}
          </aside>
          <div className={styles.mainContainer}>
            <main className={styles.mainContent}>
              <DescriptionForm />
            </main>
          </div>
        </div>
      )}
    </Formik>
  );
};

IncorporationPage.displayName = displayName;

export default IncorporationPage;
