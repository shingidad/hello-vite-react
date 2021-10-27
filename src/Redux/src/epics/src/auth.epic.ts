import { CallHistoryMethodAction } from 'connected-react-router';
import { LocationDescriptorObject } from 'history';
import { Epic } from 'redux-observable';
import { catchError, filter, from, map, of, switchMap, tap } from 'rxjs';
import { isActionOf, RootAction, RootState, Service } from 'typesafe-actions';
import actions from '../../actions';

/**
 * 로그인 액션이 온다면 service에 login을 요청한다.
 * @param action$ 
 * @param store$ 
 * @param service$ 
 * @returns 
 */
export const requestLoginEpic: Epic<
  RootAction,
  RootAction,
  RootState,
  Service
> = (action$, store$, service$) =>
  action$.pipe(
    // 로그인 request 액션 구분 filter
    filter(isActionOf(actions.authActions.requestLogin.request)),
    switchMap(({ payload }) =>
      // 서비스에 로그인 요청
      from(service$.authService.login(payload)).pipe(
        // 성공시 로그인 성공 액션 발생
        map(actions.authActions.requestLogin.success),
        // 실패시 로그인 실패 액션 발생
        catchError((e: Error) => {
          console.log(e.message);
          return of(actions.authActions.requestLogin.failure(401));
        })
      )
    )
  );

/**
 * 로그인 완료 된 이후 이동할 페이지 설정
 * @param action$
 * @returns
 */
export const pageLoginEpic: Epic<
  RootAction,
  CallHistoryMethodAction<[LocationDescriptorObject<unknown>]>,
  RootState,
  Service
> = (action$) =>
  action$.pipe(
    // 로그인 성공 액션 구분 filter
    filter(isActionOf(actions.authActions.requestLogin.success)),
    // 로그인 성공 액션을 발생한 이후 페이지 이동 액션 발생
    map(() =>
      actions.routerActions.replace({
        pathname: '/about',
      })
    )
  );
