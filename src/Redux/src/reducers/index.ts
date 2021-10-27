import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { combineReducers } from 'redux';
import auth from './src/auth.reducer';

export const history = createBrowserHistory();

const rootReducer = combineReducers({ router: connectRouter(history), auth });

export default rootReducer;
