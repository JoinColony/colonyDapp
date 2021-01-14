import React, { useCallback, useMemo, ReactNode, ComponentProps } from 'react';
import { defineMessages } from 'react-intl';

import { Appearance, Select, SelectOption } from '~core/Fields';
import ColorTag, { Color } from '~core/ColorTag';

import styles from './ColorSelect.css';

const MSG = defineMessages({
  labelColorSelect: {
    id: 'ColorSelect.labelColorSelect',
    defaultMessage: 'Select color',
  },
});

interface Props {
  /** Should `select` be disabled */
  disabled?: boolean;

  /** Active color */
  activeOption: Color;

  /** Callback function, called after value is changed */
  onColorChange?: (color: Color) => any;

  appearance?: Appearance;

  /*
   * Name of the form element
   */
  name?: string;
}

const displayName = 'ColorSelect';

const ColorSelect = ({
  disabled,
  activeOption,
  onColorChange,
  appearance,
  name = 'color',
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
    <div className={styles.main}>
      <Select
        appearance={{
          theme: 'grid',
          alignOptions: appearance?.alignOptions,
        }}
        elementOnly
        label={MSG.labelColorSelect}
        name={name}
        onChange={(val) => {
          onChange(Number(val));
        }}
        options={options}
        renderActiveOption={renderActiveOption}
        disabled={disabled}
      />
    </div>
  );
};

ColorSelect.displayName = displayName;

export default ColorSelect;
