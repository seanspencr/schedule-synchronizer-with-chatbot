import * as AuthSession from 'expo-auth-session';
export function useMicrosoftLogin(){
    const microsoftConfig = {
       CLIENT_ID: process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID,
       REDIRECT_URI: 'http://localhost:8081',
      //  discovery: {
      //    authorizationEndpoint: `https://login.microsoftonline.com/${process.env.EXPO_PUBLIC_MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
      //    tokenEndpoint: `https://login.microsoftonline.com/${process.env.EXPO_PUBLIC_MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      //  },
    
      discovery: {
         // Change the tenant ID variable to 'common'
         authorizationEndpoint: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
         tokenEndpoint: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
       }
    };

    const redirectUri = AuthSession.makeRedirectUri();
     console.log("useMicrosoftLogin :  Redirect URI:", redirectUri);
    const [microsoftRequest, microsoftResponse, microsoftPromptAsync] = AuthSession.useAuthRequest(
        {
          clientId: microsoftConfig.CLIENT_ID!,
          redirectUri: redirectUri,
          scopes: ['openid', 'profile', 'email', 'Calendars.Read'],
          responseType: AuthSession.ResponseType.Code,
        },
        microsoftConfig.discovery
      );

    return [microsoftRequest, microsoftResponse, microsoftPromptAsync];

}