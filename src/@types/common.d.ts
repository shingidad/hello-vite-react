declare global {
  /**
   * 로그인 완료 Response Body
   */
  interface LoginResponseBody {
    token: string;
    isLogin: boolean;
  }
  /**
   * 로그인 Request Body
   */
  interface LoginRequestBody {
    id: string;
    password: string;
  }
}

export {};
