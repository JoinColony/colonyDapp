import React, { useCallback, useMemo, ReactNode, ComponentProps } from 'react';
import { defineMessages } from 'react-intl';

import { Appearance, Select, SelectOption, Form } from '~core/Fields';
import ColorTag, { Color } from '~core/ColorTag';

import styles from './ColorSelect.css';

const MSG = defineMessages({
  labelColorSelect: {
    id: 'ColorSelect.labelColorSelect',
    defaultMessage: 'Select color',
  },
});

interface FormValues {
  activeColor: Color;
}

interface Props {
  /** Should `select` be disabled */
  disabled?: boolean;

  /** Active color */
  activeOption: Color;

  /** Callback function, called after value is changed */
  onColorChange?: (color: Color) => any;

  appearance?: Appearance;
}

const displayName = 'ColorSelect';

const ColorSelect = ({
  disabled,
  activeOption,
  onColorChange,
  appearance,
}: Props) => {
  const onChange = useCallback(
    (color: Color) => {
      if (onColorChange) {
        return onColorChange(color);
      }
      return null;
    },
    [onColorChange],
  );

  const renderActiveOption = useCallback<
    (option: SelectOption | undefined, label: string) => ReactNode
  >(() => {
    return <ColorTag color={activeOption} />;
  }, [activeOption]);

  const options = useMemo<ComponentProps<typeof Select>['options']>(() => {
    const colors = Object.keys(Color).filter(
      (val) => typeof Color[val as any] === 'number',
    );
    return [
      ...colors.map((color) => {
        return {
          children: <ColorTag color={Color[color]} />,
          label: `${color}`,
          value: `${Color[color]}`,
        };
      }),
    ];
  }, []);

  return (
    <Form<FormValues>
      initialValues={{
        activeColor: activeOption,
      }}
      onSubmit={() => {}}
    >
      <div className={styles.main}>
        <Select
          appearance={{
            theme: 'grid',
            alignOptions: appearance?.alignOptions,
          }}
          elementOnly
          label={MSG.labelColorSelect}
          name="activeColor"
          onChange={(val) => {
            onChange(Number(val));
          }}
          options={options}
          renderActiveOption={renderActiveOption}
          disabled={disabled}
        />
      </div>
    </Form>
  );
};

ColorSelect.displayName = displayName;

export default ColorSelect;
