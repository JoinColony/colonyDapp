import React, { useState, useMemo, useCallback } from 'react';
import ReactSlider from 'rc-slider';
import 'rc-slider/assets/index.css';

type Appearance = {
  theme?: 'primary' | 'danger';
};

interface Props {
  value: number;
  max?: number;
  limit?: number;
  appearance?: Appearance;
  onChange: (val: any) => void;
}

const displayName = 'Slider';

const Slider = ({ value, max = 100, onChange, limit, appearance }: Props) => {
  const [sliderValue, setSliderValue] = useState<number>(value);

  const gradientStopPercentage = useMemo(() => {
    return limit ? Math.round((limit / max) * 100) : 0;
  }, [limit, max]);

  const onSliderChange = useCallback(
    (val): void => {
      if ((limit && sliderValue < limit) || val < sliderValue || !limit) {
        setSliderValue(val);
        onChange(val);
      }
      if (limit && sliderValue > limit) {
        setSliderValue(limit);
        onChange(limit);
      }
    },
    [setSliderValue, onChange, limit, sliderValue],
  );

  const marks = {};

  if (limit && limit < max) {
    marks[limit] = {};
  }

  const SliderStylesObject = {
    primary: {
      backgroundColor: '#68D2D2',
      borderColor: '#68D2D2',
      height: 1,
      markHeight: 5,
      markWidth: 1,
      markPositionTop: -2,
    },
    danger: {
      backgroundColor: '#FE5E7C',
      borderColor: '#FE5E7C',
      height: 3,
      markHeight: 8,
      markWidth: 2,
      markPositionTop: -3,
    },
  };

  const styles = SliderStylesObject[appearance?.theme || 'primary'];

  return (
    <ReactSlider
      min={0}
      step={1}
      value={sliderValue}
      onChange={onSliderChange}
      marks={marks}
      max={max}
      trackStyle={{
        backgroundColor: styles.backgroundColor,
        height: styles.height,
      }}
      handleStyle={{
        borderColor: styles.borderColor,
        borderWidth: 6,
        height: 15,
        width: 15,
        marginTop: -7,
        backgroundColor: '#FFFFFF',
      }}
      dotStyle={{
        height: styles.markHeight,
        width: styles.markWidth,
        backgroundColor: '#76748B',
        border: 0,
        borderRadius: 0,
        top: styles.markPositionTop,
        marginLeft: 0,
      }}
      railStyle={{
        backgroundColor: '#C2CCCC',
        height: styles.height,
        backgroundImage: `linear-gradient(90deg, #76748B 0% ${gradientStopPercentage}%, transparent ${gradientStopPercentage}%)`,
      }}
    />
  );
};

Slider.displayName = displayName;

export default Slider;
