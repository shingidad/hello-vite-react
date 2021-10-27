// src/Pages/src/HomePage.tsx
import React from 'react';
import { $Action, useDispatch } from '~/Redux';
import { useSelector } from '~/Redux';

const LoginForm = () => {
  const dispatch = useDispatch();

  const onSubmit = (
    e: Parameters<Required<React.HTMLProps<HTMLFormElement>>['onSubmit']>[0]
  ) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const id = String(data.get('id'));
    const password = String(data.get('password'));

    dispatch(
      $Action.authActions.requestLogin.request({
        id,
        password,
      })
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="id" placeholder="id" />
      <br />
      <input name="password" placeholder="password" type="password" />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};
const HomePage = () => {
  const isLogin = useSelector(({ auth }) => auth.isLogin);

  return (
    <div>
      <h1>Home Page</h1>
      {isLogin ? <div>로그인 성공</div> : <LoginForm />}
    </div>
  );
};

export default HomePage;
