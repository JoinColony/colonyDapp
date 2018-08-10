/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl, mountWithIntlContext, fieldPropsFactory } from 'testutils';

import SingleUserPicker from '../SingleUserPicker.jsx';
import { UserInfoPopover } from '../../UserInfo';
import { ESC } from '../../../../keyTypes';

const createFieldProps = fieldPropsFactory({
  selector: (_, { data }) => data,
  userInfoTypes: [],
  itemComponent: () => null,
  users: [
    {
      _id: '1',
      profile: {
        username: 'thiago',
        fullName: 'Thiago D.',
        address: 'thiagoxaddress',
      },
    },
    {
      _id: '2',
      profile: {
        username: 'chris',
        fullName: 'Christian M.',
        address: 'chrisxaddress',
      },
    },
  ],
}, {
  utils: {
    getIntlFormatted: jest.fn(),
  },
  elementOnly: true,
  label: 'recipient',
},
);

jest.mock('../../../../users/components/UserAvatar', () => () => null);

describe('SingleUserPicker component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl((
      <SingleUserPicker
        {...createFieldProps()}
      />
    ));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('User selector open on focus', () => {
    const onChangeSpy = jest.fn();
    const wrapper = mountWithIntlContext((
      <SingleUserPicker
        {...createFieldProps({ onChange: onChangeSpy })}
      />
    ));
    wrapper.instance().handleFocus();
    expect(wrapper).toHaveState('omniPickerOpen', true);
    expect(wrapper.html()).toContain('data-enzyme-hook="omni-picker"');
  });

  test('ESC closes user selector, always', () => {
    const onChangeSpy = jest.fn();
    const wrapper = mountWithIntlContext((
      <SingleUserPicker
        {...createFieldProps({ onChange: onChangeSpy })}
      />
    ));
    const input = wrapper.find('input');
    wrapper.instance().handleFocus();
    expect(wrapper).toHaveState('omniPickerOpen', true);
    input.simulate('keyup', { key: ESC });
    expect(wrapper).toHaveState('omniPickerOpen', false);
  });

  test('If user selected has Avatar (it tests the UserInfoPopover wrapper as the Avatar is mocked)', () => {
    const currentSelectedUser = {
      _id: '1',
      profile: {
        username: 'thiago',
        fullName: 'Thiago D.',
        address: 'thiagoxaddress',
      },
    };
    const onChangeSpy = jest.fn();

    const wrapper = mountWithIntlContext((
      <SingleUserPicker
        {...createFieldProps({ onChange: onChangeSpy })}
      />
    ));
    wrapper.setState({ selectedUser: currentSelectedUser });
    expect(wrapper.find(UserInfoPopover)).toBePresent();
  });


  test('If user selected input is hidden', () => {
    const currentSelectedUser = {
      _id: '1',
      profile: {
        username: 'thiago',
        fullName: 'Thiago D.',
        address: 'thiagoxaddress',
      },
    };
    const onChangeSpy = jest.fn();

    const wrapper = mountWithIntlContext((
      <SingleUserPicker
        {...createFieldProps({ onChange: onChangeSpy })}
      />
    ));
    wrapper.setState({ selectedUser: currentSelectedUser });
    expect(wrapper.find('input[hidden]')).toBePresent();
  });
});
