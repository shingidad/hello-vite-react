import { combineEpics } from 'redux-observable';
import * as authEpic from './src/auth.epic';

export default combineEpics(...Object.values(authEpic));
