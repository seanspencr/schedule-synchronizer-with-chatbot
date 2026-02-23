import { Text, View, TextInput, TouchableOpacity, Alert, Button } from "react-native";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function Index() {
  WebBrowser.maybeCompleteAuthSession();

  const [userInfo, setUserInfo] = useState(null);

  //client IDs from .env
  const config = {
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

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
  console.log("Redirect URI:", redirectUri);
  const [microsoftRequest, microsoftResponse, microsoftPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: microsoftConfig.CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ['openid', 'profile', 'email', 'Calendars.Read'],
      responseType: AuthSession.ResponseType.Code,
    },
    microsoftConfig.discovery
  );

  

  const getUserInfoWithGoogle = async (token) => {
    //absent token
    if (!token) return;
    //present token
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      //store user information  in Asyncstorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error(
        "Failed to fetch user data:",
        response.status,
        response.statusText
      );
    }
  };

  const signInWithGoogle = async () => {
  try {
    // Attempt to retrieve user information from AsyncStorage
    const userJSON = await AsyncStorage.getItem("user");

    if (userJSON) {
      // If user information is found in AsyncStorage, parse it and set it in the state
      setUserInfo(JSON.parse(userJSON));
    } else if (response?.type === "success") {
      // If no user information is found and the response type is "success" (assuming response is defined),
      // call getUserInfo with the access token from the response
      getUserInfoWithGoogle(response.authentication.accessToken);
    }
  } catch (error) {
    // Handle any errors that occur during AsyncStorage retrieval or other operations
    console.error("Error retrieving user data from AsyncStorage:", error);
  }
};

//add it to a useEffect with response as a dependency 
useEffect(() => {
  signInWithGoogle();
}, [response]);

const fetchMicrosoftUserData = async (token) => {
  try {
    const response = await fetch("https://graph.microsoft.com/oidc/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await response.json();

    console.log("Microsoft user data:", user);
    // setUserInfo(normalizedUser);
    // await AsyncStorage.setItem("user", JSON.stringify(normalizedUser));
    await fetchCalendarMicrosoft(token);
  } catch (error) {
    console.error("Failed to fetch Microsoft user data:", error);
  }
};

async function fetchCalendarMicrosoft(token : string){
      let res = await fetch("https://graph.microsoft.com/v1.0/me/calendar/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = await res.json();
      console.log("Microsoft calendar events:", data);
}

const exchangeCodeForToken = async (microsoftResponse) => {
      if(microsoftRequest == null || microsoftRequest.codeVerifier === undefined || microsoftRequest.codeVerifier === null ) {
        console.error("Code verifier is undefined. Cannot exchange code for token.");
        return;
      }
  
      try {
        const { code } = microsoftResponse.params;
        const response = await fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: microsoftConfig.CLIENT_ID,
            code: code,
            redirect_uri: redirectUri, // Must match EXACTLY what was sent in the request
            grant_type: 'authorization_code',
            code_verifier: microsoftRequest.codeVerifier, // Include the code verifier for PKCE
          }).toString(),
        });

        const data = await response.json();
        
        if (data.access_token) {
          // Now that you have the token, go get the user data!
          fetchMicrosoftUserData(data.access_token);
        }
      } catch (error) {
        console.error("Token exchange failed:", error);
      }
    };

useEffect(() => {
  console.log("Microsoft response:", microsoftResponse);
  if (microsoftResponse && microsoftResponse.type === 'success') {
    exchangeCodeForToken(microsoftResponse);
  }
}, [microsoftResponse]);


//log the userInfo to see user details
console.log("userInfo:", JSON.stringify(userInfo))


  const API_URL = "http://10.0.2.2:8000"; // Replace 3000 with your backend port
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch(`${API_URL}/users`).then(res => res.json()).then(
      data => {
      console.log(data);
      Alert.alert("Success", JSON.stringify(data));
    }).catch(err => {
      console.error(err);
      Alert.alert("Error", "Login failed!");
    });
  };


  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
        Login
      </Text>

      {
        userInfo && (
          <Text>
            userInfo: {JSON.stringify(userInfo)}
          </Text>
        )
      }

      <TextInput
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 15,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 20,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          width: "100%",
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          Login
        </Text>
      </TouchableOpacity>

      <Button title= "sign in with google" onPress={()=>{promptAsync()}}/>
      <Button title= "sign in with microsoft" onPress={()=>{microsoftPromptAsync()}}/>


    </View>
  );
}