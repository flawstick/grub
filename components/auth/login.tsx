// LoginScreen.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  I18nManager,
  Alert,
} from "react-native";
import tw from "twrnc";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface LoginScreenProps {
  selectedCompany: any;
  auth: any;
  login: (
    username: string,
    password: string,
    tenantId: string,
  ) => Promise<void>;
}

const LoginScreen = ({ selectedCompany, auth, login }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Shared values for animations
  const shakeUsername = useSharedValue(0);
  const shakePassword = useSharedValue(0);
  const shakeErrorMessage = useSharedValue(0);
  const rotateLoader = useSharedValue(0);

  // Animated styles
  const animatedUsernameStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeUsername.value }],
  }));

  const animatedPasswordStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakePassword.value }],
  }));

  const animatedErrorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeErrorMessage.value }],
  }));

  const animatedLoaderStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateLoader.value}deg` }],
  }));

  // Effect to handle shaking animations based on auth errors
  useEffect(() => {
    if (auth.error?.wrongCredential === "username") {
      shakeUsername.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }

    if (auth.error?.wrongCredential === "password") {
      shakePassword.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }

    if (auth.error?.message) {
      shakeErrorMessage.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }

    // Handle loader rotation
    if (auth.loading) {
      rotateLoader.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1, // Infinite
      );
    } else {
      rotateLoader.value = withTiming(0, { duration: 500 });
    }
  }, [auth.error, auth.loading]);

  // Handle Login
  const handleLogin = async () => {
    try {
      await login(username, password, selectedCompany?.tenantId ?? "");
    } catch (error) {
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  // Handle Biometric Login
  const handleBiometricLogin = () => {
    console.log("Biometric login attempted");
    Alert.alert("Biometric Login", "Biometric login is not implemented yet.");
  };

  return (
    <View style={tw`flex-1 bg-white p-6 justify-center`}>
      <Text style={tw`text-3xl font-bold mb-8 mt-8 text-right`}>ברוך הבא</Text>

      <View style={tw`space-y-6`}>
        {/* Username Field */}
        <View style={tw`space-y-2`}>
          <Text style={tw`text-right text-lg`}>שם משתמש</Text>
          <Animated.View style={[animatedUsernameStyle]}>
            <TextInput
              style={tw.style(
                "w-full py-3 px-2 border-b-2 bg-transparent text-lg",
                auth.error?.wrongCredential === "username"
                  ? "border-red-600"
                  : "border-gray-300",
              )}
              placeholder="הזן שם משתמש"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              textAlign="right"
            />
            {auth.error?.wrongCredential === "username" && (
              <Text style={tw`text-red-600 text-sm mt-1 text-right`}>
                שם המשתמש שגוי
              </Text>
            )}
          </Animated.View>
        </View>

        {/* Password Field */}
        <View style={tw`space-y-2`}>
          <Text style={tw`text-right text-lg`}>סיסמה</Text>
          <Animated.View style={[animatedPasswordStyle]}>
            <TextInput
              style={tw.style(
                "w-full py-3 px-2 border-b-2 bg-transparent text-lg",
                auth.error?.wrongCredential === "password"
                  ? "border-red-600"
                  : "border-gray-300",
              )}
              placeholder="הזן סיסמה"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              textAlign="right"
            />
            {auth.error?.wrongCredential === "password" && (
              <Text style={tw`text-red-600 text-sm mt-1 text-right`}>
                הסיסמה שגויה
              </Text>
            )}
          </Animated.View>
        </View>

        {/* Error Message */}
        {auth.error?.message && (
          <Animated.View style={[animatedErrorStyle]}>
            <Text style={tw`text-red-600 text-sm text-center mt-2`}>
              {auth.error.message}
            </Text>
          </Animated.View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={auth.loading}
          style={tw`w-full py-4 bg-blue-600 rounded-full mt-4 flex-row justify-center items-center`}
        >
          {auth.loading ? (
            <Animated.View style={[animatedLoaderStyle]}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </Animated.View>
          ) : (
            <Text style={tw`text-lg font-semibold text-white text-center`}>
              {auth.error ? "נסה שוב" : "התחבר"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Bottom Buttons */}
        <View style={tw`flex-row justify-between items-center mt-4`}>
          {/* Biometric Login */}
          <TouchableOpacity
            onPress={handleBiometricLogin}
            style={tw`flex-row items-center`}
          >
            <Ionicons
              name="finger-print"
              size={24}
              color="#2563EB"
              style={tw`ml-2`}
            />
            <Text style={tw`text-blue-600`}>התחברות ביומטרית</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-gray-800`}>שכחת סיסמה?</Text>
              <Ionicons
                name="chevron-back"
                size={20}
                color="#2563EB"
                style={tw`mr-1`}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
