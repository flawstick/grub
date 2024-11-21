import { useAuth } from "@/components/providers/auth-provider";
import { useCompanyStore } from "@/lib/store/companyStore";
import { Redirect, Slot } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, isLoggedIn } = useAuth();
  if (!user && !isLoggedIn) return <Redirect href="/auth" />;
  const { fetchSelectedCompanyData, selectedCompany} = useCompanyStore();

  useEffect(() => {
      fetchSelectedCompanyData();
  }, [selectedCompany]);

  return (
    <Slot />
  );
}

