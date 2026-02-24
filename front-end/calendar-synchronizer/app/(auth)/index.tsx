import { Text, View, TextInput, TouchableOpacity, Alert, Button } from "react-native";
import { useState, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Index() {
  WebBrowser.maybeCompleteAuthSession();

  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  //client IDs from .env
  const config = {
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
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

  const getCalendarEvents = async (token) => {
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    console.log("Events:", data.items);
    setCalendarEvents(data.items);

        // {
    //   "kind":"calendar#event",
    //   "etag":"\"3465343751906000\"",
    //   "id":"32lj6e69abdf5q9gaut4u3e2hh",
    //   "status":"confirmed",
    //   "htmlLink":"https://www.google.com/calendar/event?eid=MzJsajZlNjlhYmRmNXE5Z2F1dDR1M2UyaGggc2VhbnNwZW5jZXIyODA4MDZAbQ",
    //   "created":"2024-11-27T01:44:35.000Z",
    //   "updated":"2024-11-27T01:44:35.953Z",
    //   "summary":"Kelas",
    //   "colorId":"6",
    //   "creator":{
    //     "email":"seanspencer280806@gmail.com",
    //     "self":true
    //   },
    //   "organizer":{
    //     "email":"seanspencer280806@gmail.com",
    //     "self":true
    //   },
    //   "start":{
    //     "dateTime":"2024-12-17T07:00:00+07:00",
    //     "timeZone":"Asia/Jakarta"
    //   },
    //   "end":{
    //     "dateTime":"2024-12-17T13:00:00+07:00",
    //     "timeZone":"Asia/Jakarta"
    //   },
    //   "iCalUID":"32lj6e69abdf5q9gaut4u3e2hh@google.com",
    //   "sequence":0,
    //   "reminders":{
    //     "useDefault":true
    //   },
    //   "eventType":"default"
    // }
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

    getCalendarEvents(response.authentication.accessToken);
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

      {
        calendarEvents.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Calendar Events:
            </Text>
            {calendarEvents.map((event) => (
              <View key={event.id} style={{ marginBottom: 10 }}>
                <Text>{JSON.stringify(event)}</Text>
                <Text style={{ fontSize: 16 }}>{event.summary}</Text>
                <Text style={{ color: "#666" }}>
                  {new Date(event.start.dateTime).toLocaleString()} -{" "}
                  {new Date(event.end.dateTime).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
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
      <Button onPress={() => router.push("/(auth)/loginScreen")} title="Navigate to login screen" />
      <Button onPress={() => router.push("/(main)/dashboard")} title="Navigate to main screen" />

    </View>
  );
}