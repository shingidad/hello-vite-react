import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import $Actions from '../../actions';

type LoginStore = {
  isLogin: boolean;
  count: number;
};

const loginReducer = createReducer<LoginStore>({
  isLogin: false,
  count: 0,
}).handleAction(
  $Actions.authActions.requestLogin.success,
  (state, { payload }) => {
    const { isLogin } = payload;
    return produce(state, (draft) => {
      draft.isLogin = isLogin;
    });
  }
);

export default loginReducer;
