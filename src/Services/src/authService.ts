export const login = (
  loginRequestBody: LoginRequestBody
): Promise<LoginResponseBody> => {
  return new Promise<LoginResponseBody>((resolve) => {
    const { id, password } = loginRequestBody;
    setTimeout(() => {
      resolve({ isLogin: true, token: `example-${id}-${password}` });
    }, 500);
  });
};
