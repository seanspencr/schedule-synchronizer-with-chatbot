import axios from "axios";
export function useGoogleCodeLogin(googleAuthCode : string, codeVerifier : string, redirectUri : string){
    
    
    const apiUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`;

    async function exchangeCodeForToken(code: string){
        if(googleAuthCode == null || googleAuthCode == undefined || googleAuthCode == "") return;

        console.log("Exchanging code for token with code:", code);
        try {
          const response = await axios.post(`${apiUrl}/auth/register/google`, { "authCode" : code, "codeVerifier" : codeVerifier , "redirectUri" : redirectUri});
          return response.data; // Assuming the backend returns the token in the response body
        } catch (error) {
          console.error("Error exchanging code for token:", error);
          throw error;
        }
      };

    return exchangeCodeForToken(googleAuthCode);
}