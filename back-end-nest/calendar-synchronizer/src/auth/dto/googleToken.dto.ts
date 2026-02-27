export interface GoogleTokenResponse {
  access_token: string;
  refresh_token_expires_in: number;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
}