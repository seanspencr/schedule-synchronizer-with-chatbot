import { Text, View, TextInput, TouchableOpacity, Alert, Button } from "react-native";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    </View>
  );
}