import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore, PreloadedState } from 'redux';
import { RootState } from 'typesafe-actions';
import reducer, { history } from './reducers';

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const initialState: PreloadedState<RootState> = {};

// Redux Devtools 연결
const composeEnhancers =
	(process.env.NODE_ENV === 'development' &&
		window &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose;

const middlewares = [routerMiddleware(history)];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(reducer, initialState, enhancer);

export default store;