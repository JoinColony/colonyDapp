/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { mountWithIntl } from '~testutils';

import Icon from '../Icon';
import { icons as iconNames } from '../../../../../img/icons.json';

describe('Icon component', () => {
  const mockFileName = iconNames[0];
  const mockTitle = 'The Greatest Icon Ever';
  test('Renders initial component', () => {
    const wrapper = mountWithIntl(
      <Icon name={mockFileName} title={mockTitle} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test('Works with MessageDescriptors', () => {
    const wrapper = mountWithIntl(
      <Icon
        name={mockFileName}
        title={{ id: 'iconTitle', defaultMessage: mockTitle }}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  test('Shows the title value', () => {
    const wrapper = mountWithIntl(
      <Icon name={mockFileName} title={mockTitle} />,
    );
    expect(wrapper.html()).toContain(mockTitle);
  });
});
