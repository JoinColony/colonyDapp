/* eslint-env jest */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

/*
 * Custom validations need to be imported, otherwise all files that rely internally
 * on them will fail tests
 *
 * Eg: `ProfileCreate` who is relying on `StepSelectToken` which
 * uses a custom validator internally
 */
import '../modules/validations';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../i18n/en.json', () => ({}));
