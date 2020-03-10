import { useEffect } from 'react';
import { useField } from 'formik';

interface Props {
  name: string;
  value: number;
}

const displayName = 'dashboard.LevelEdit.NumTotalSteps';

/**
 * Uses `setValue` to force validation anytime the total steps are
 * updated outside the form (adding or removing steps, mostly)
 */
const NumTotalSteps = ({ name, value: newValue }: Props) => {
  const [, { value }, { setValue }] = useField(name);
  useEffect(() => {
    if (newValue !== value) {
      setValue(newValue);
    }
  }, [newValue, setValue, value]);
  return null;
};

NumTotalSteps.displayName = displayName;

export default NumTotalSteps;
