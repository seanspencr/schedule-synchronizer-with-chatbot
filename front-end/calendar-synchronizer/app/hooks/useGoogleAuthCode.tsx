import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
export function useGoogleAuthCode(){
    const config = {
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    
    responseType: 'code', 
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  
    shouldAutoExchangeCode: false
  };
    const [request, response, promptAsync] = Google.useAuthRequest(config);
    return [request, response, promptAsync];
} 