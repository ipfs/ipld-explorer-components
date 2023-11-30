/* globals globalThis */

import initHelia from '../lib/init-helia.js';
const defaultState = {
  kuboGatewayOptions: {
    host: '127.0.0.1',
    port: '8080',
    protocol: 'http'
  },
  instance: null,
  error: null
};
function getUserOpts(key) {
  let userOpts = {};
  if (globalThis.localStorage != null) {
    try {
      const optsStr = globalThis.localStorage.getItem(key) ?? '{}';
      userOpts = JSON.parse(optsStr);
    } catch (error) {
      console.error(`Error reading '${key}' value from localStorage`, error);
    }
  }
  return userOpts;
}
const bundle = {
  name: 'helia',
  reducer(state, _ref) {
    let {
      type,
      payload,
      error
    } = _ref;
    state = state ?? defaultState;
    if (type === 'HELIA_INIT_FINISHED') {
      return Object.assign({}, state, {
        instance: payload.instance ?? state.instance,
        kuboGatewayOptions: payload.kuboGatewayOptions ?? state.kuboGatewayOptions,
        error: null
      });
    }
    if (type === 'HELIA_INIT_FAILED') {
      return Object.assign({}, state, {
        error
      });
    }
    return state;
  },
  selectHelia: _ref2 => {
    let {
      helia
    } = _ref2;
    return helia.instance;
  },
  selectHeliaReady: _ref3 => {
    let {
      helia
    } = _ref3;
    return helia.instance !== null;
  },
  selectHeliaIdentity: _ref4 => {
    let {
      helia
    } = _ref4;
    const identifyService = helia.instance?.libp2p.services?.identify;
    return identifyService?.host?.agentVersion.split(' ')[0] ?? 'null';
  },
  doInitHelia: () => async _ref5 => {
    let {
      dispatch,
      getState
    } = _ref5;
    dispatch({
      type: 'HELIA_INIT_STARTED'
    });
    const kuboGatewayOptions = Object.assign({}, getState().helia.kuboGatewayOptions, getUserOpts('kuboGateway'));
    try {
      console.info("🎛️ Customise your Kubo gateway opts by setting an `kuboGateway` value in localStorage. e.g. localStorage.setItem('kuboGateway', JSON.stringify({port: '1337'}))");
      console.time('HELIA_INIT');
      const helia = await initHelia(kuboGatewayOptions);
      console.timeEnd('HELIA_INIT');
      return dispatch({
        type: 'HELIA_INIT_FINISHED',
        payload: {
          kuboGatewayOptions,
          instance: helia,
          provider: 'helia'
        }
      });
    } catch (error) {
      return dispatch({
        type: 'HELIA_INIT_FAILED',
        error
      });
    }
  }
};
export default bundle;