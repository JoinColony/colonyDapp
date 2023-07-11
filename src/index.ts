import { createElement } from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';
import { errors } from 'ethers';

import './styles/main.css';
import './modules/validations';

import App from './App';
import store from '~redux/createReduxStore';
import { getBeamerInitialize, getBeamerId } from '~utils/external';

errors.setLogLevel('error');

const rootNode = document.getElementById('root');

if (rootNode) {
  ReactModal.setAppElement(rootNode);
  render(createElement(App, { store }), rootNode);
}

// @ts-ignore
if (module.hot) module.hot.accept();

// Initiate Beamer
if (getBeamerId) {
  getBeamerInitialize(getBeamerId);
}
