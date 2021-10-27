import { createAsyncAction } from 'typesafe-actions';

export const requestLogin = createAsyncAction(
  '@@LOGIN/LOGIN/REQUEST', // 요청
  '@@LOGIN/LOGIN/SUCCESS', // 성공
  '@@LOGIN/LOGIN/FAIL' // 실패
)<
  // 요청 타입
  LoginRequestBody,
  // 성공 타입
  LoginResponseBody,
  // 실패 타입
  number
>();
