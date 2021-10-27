import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore, PreloadedState } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { RootAction, RootState, Service } from 'typesafe-actions';
import reducer, { history } from './reducers';
import services from '../../Services';
import epics from './epics';

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

/**
 * Epic Middleware 생성
 */
export const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Service
>({
  dependencies: services, // 서비스 추가
});

const middlewares = [epicMiddleware, routerMiddleware(history)];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(reducer, initialState, enhancer);
// epic 실행
epicMiddleware.run(epics);

export default store;
