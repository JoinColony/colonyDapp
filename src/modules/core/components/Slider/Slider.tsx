import React, { useState, useMemo, useCallback } from 'react';
import ReactSlider from 'rc-slider';
import { useField } from 'formik';

import 'rc-slider/assets/index.css';

type Appearance = {
  theme?: 'primary' | 'danger';
  size?: 'thin' | 'thick';
};

interface Props {
  value: number;
  max?: number;
  limit?: number;
  appearance?: Appearance;
  onChange: (val: any) => void;
  name: string;
}

const displayName = 'Slider';

const Slider = ({
  value,
  max = 100,
  onChange,
  limit,
  appearance,
  name,
}: Props) => {
  const [sliderValue, setSliderValue] = useState<number>(value);
  const [, , { setValue }] = useField(name);

  const gradientStopPercentage = useMemo(() => {
    return limit ? Math.round((limit / max) * 100) : 0;
  }, [limit, max]);

  const onSliderChange = useCallback(
    (val): void => {
      if ((limit && sliderValue < limit) || val < sliderValue || !limit) {
        setSliderValue(val);
        setValue(val);
        onChange(val);
      }
      if (limit && sliderValue > limit) {
        setSliderValue(limit);
        setValue(val);
        onChange(limit);
      }
    },
    [setSliderValue, onChange, limit, sliderValue],
  );

  const marks = {};

  if (limit && limit < max) {
    marks[limit] = {};
  }

  const SliderColorsObject = {
    primary: {
      backgroundColor: '#68D2D2',
      borderColor: '#68D2D2',
    },
    danger: {
      backgroundColor: '#FE5E7C',
      borderColor: '#FE5E7C',
    },
  };

  const SliderSizesObject = {
    thin: {
      height: 1,
      markHeight: 5,
      markWidth: 1,
      markPositionTop: -2,
    },
    thick: {
      height: 3,
      markHeight: 8,
      markWidth: 2,
      markPositionTop: -3,
    },
  };

  const colors = SliderColorsObject[appearance?.theme || 'primary'];
  const sizes = SliderSizesObject[appearance?.size || 'thin'];

  return (
    <ReactSlider
      min={0}
      step={1}
      value={sliderValue}
      onChange={onSliderChange}
      marks={marks}
      max={max}
      trackStyle={{
        backgroundColor: colors.backgroundColor,
        height: sizes.height,
      }}
      handleStyle={{
        borderColor: colors.borderColor,
        borderWidth: 6,
        height: 15,
        width: 15,
        marginTop: -7,
        backgroundColor: '#FFFFFF',
      }}
      dotStyle={{
        height: sizes.markHeight,
        width: sizes.markWidth,
        backgroundColor: '#76748B',
        border: 0,
        borderRadius: 0,
        top: sizes.markPositionTop,
        marginLeft: 0,
      }}
      railStyle={{
        backgroundColor: '#C2CCCC',
        height: sizes.height,
        backgroundImage: `linear-gradient(90deg, #76748B 0% ${gradientStopPercentage}%, transparent ${gradientStopPercentage}%)`,
      }}
    />
  );
};

Slider.displayName = displayName;

export default Slider;
