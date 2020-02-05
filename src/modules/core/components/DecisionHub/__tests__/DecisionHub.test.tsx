/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';
import { Formik } from 'formik';

import { mountWithIntl } from '../../../../../__tests__/utils';

import DecisionHub from '../DecisionHub';

describe('DecisionHub component', () => {
  test('Renders initial component', () => {
    const options = [
      {
        value: 'create',
        title: 'Create Title',
        subtitle: 'Create Subtitle',
      },
      {
        value: 'select',
        title: 'Select Title',
        subtitle: 'Select Subtitle',
      },
    ];

    // @ts-ignore
    const wrapper = mountWithIntl(
      <Formik initialValues={{}} onSubmit={() => undefined}>
        <DecisionHub name="decisionHubTest" options={options} />
      </Formik>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
