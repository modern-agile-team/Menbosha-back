export interface AuthServiceInterface {
  login(authorizeCode: string, provider: string): Promise<any>;
  unlink(
    accessToken: string,
    refreshToken: string,
    provider: string,
  ): Promise<any>;
}
