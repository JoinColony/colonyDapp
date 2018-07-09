import { reduxForm } from 'redux-form';
import Mnemonic, { reduxFormOpts } from './Mnemonic.jsx';

export default reduxForm(reduxFormOpts)(Mnemonic);