export interface AuthServiceInterface {
  login(authorizeCode: string, provider: string): Promise<any>;
  unlink(
    provider: string,
    accessToken: string,
    refreshToken?: string,
  ): Promise<any>;
}
