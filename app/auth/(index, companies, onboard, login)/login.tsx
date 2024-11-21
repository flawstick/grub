import Login from "@/components/auth/login";
import { Stack, router } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";
import { useCompanyStore } from "@/lib/store/companyStore";
import {  useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import LottieView from "lottie-react-native";

export default function LoginRoute() {
    const auth = useAuth();
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    if (auth.user) router.navigate("/");
  }, [auth.user]);

  return (
      <>
      <Stack.Screen options={{
          title: "התחברות",
          headerTitleStyle: { fontFamily: "fredoka-semibold", fontSize: 20 },
      }} />
    <Login
      auth={auth}
      login={auth.login}
      selectedCompany={selectedCompany}
    />
    <LottieView
        source={require("@/assets/lottie/bike.json")}
        autoPlay
        loop
        style={{
            position: "absolute",
            bottom: 0,
            height: "30%",
            width: "100%",
            zIndex: -1,
        }}
    />
    </>
  );
}



