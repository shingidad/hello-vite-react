import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { combineReducers } from 'redux';

export const history = createBrowserHistory();

const rootReducer = combineReducers({ router: connectRouter(history) });

export default rootReducer;