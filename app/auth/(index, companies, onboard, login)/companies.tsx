import CompanyList from "@/components/auth/company-list";
import { Stack, router } from "expo-router";
import { useScrollRef } from "@/lib/tab-to-top";
import * as Haptics from "expo-haptics";
import { useCompanyStore } from "@/lib/store/companyStore";
import { useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent } from "react-native";

export default function CompanyListRoute() {
  const ref = useScrollRef();
  const companyStore = useCompanyStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    companyStore.fetchCompanies();
  }, []);

  return (
      <>
      <Stack.Screen options={{
            headerSearchBarOptions: {
            placeholder: "חיפוש חברה",
            tintColor: "#fd8000",
            onChangeText: (text: NativeSyntheticEvent<any>) => {
                setSearch(text.nativeEvent.text);
            },
            cancelButtonText: "ביטול",
            hideWhenScrolling: false,
          },
          title: "חברות",
          headerTitleStyle: { fontFamily: "fredoka-semibold", fontSize: 20 },
      }} />
    <CompanyList
      companies={companyStore.companies}
      handleSelection={companyStore.setSelectedCompany}
      search={search}
    />
    </>
  );
}


