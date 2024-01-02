export interface AuthServiceInterface {
  login(authorizeCode: string, provider: string): Promise<any>;
}
