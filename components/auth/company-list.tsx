import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  I18nManager,
} from "react-native";
import tw from "twrnc";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useCompanyStore } from "@/lib/store/companyStore";

// Enable RTL layout
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

// Custom Avatar Component
const AvatarComponent = ({ children }: any) => {
  return (
    <View
      style={tw`w-12 h-12 rounded-full bg-gray-200 justify-center items-center`}
    >
      {children}
    </View>
  );
};

// Custom AvatarFallback Component
const AvatarFallback = ({ children }: any) => {
  return <Text style={tw`text-lg font-medium text-gray-600`}>{children}</Text>;
};

// Animated List Item Component
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CompanyListProps {
  handleSelection: (item: any) => void;
  searchTerm: string;
  companies: any[];
}

export default function CompanyList({
  handleSelection,
  searchTerm,
  companies,
}: CompanyListProps) {
  const { fetchCompanies } = useCompanyStore();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh control
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCompanies();
    setRefreshing(false);
  }, [fetchCompanies]);

  const filteredItems = companies.filter((item) =>
    item.name.includes(searchTerm),
  );

  // Define Reanimated animations for the list items
  const animateItem = (index) => {
    const translateY = useSharedValue(20);
    const opacity = useSharedValue(0);

    useEffect(() => {
      translateY.value = withDelay(
        index * 100,
        withTiming(0, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      );
      opacity.value = withDelay(
        index * 100,
        withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));

    return animatedStyle;
  };

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow bg-white pt-6 pb-20 px-4`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#FF8000"]}
          tintColor="#FF8000"
          title="Refreshing..."
          titleColor="#FF8000"
        />
      }
    >
      {/* StyleNoSelect Equivalent */}
      {/* React Native doesn't support user-select CSS property, so this can be omitted */}

      {filteredItems.map((item, index) => {
        const animatedStyle = animateItem(index);
        return (
          <AnimatedTouchable
            key={item.tenantId} // Using tenantId as the key
            onPress={() => handleSelection(item)}
            style={[
              tw`flex-row items-center bg-white border border-gray-200 rounded-full p-4 mb-3 shadow-md`,
              animatedStyle,
            ]}
            activeOpacity={0.7}
          >
            {/* Avatar */}
            <AvatarComponent>
              <AvatarFallback>
                {item.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </AvatarComponent>

            {/* Company Name */}
            <Text style={tw`flex-grow text-right mr-3 font-medium text-lg`}>
              {item.name}
            </Text>

            {/* Chevron Icon */}
            <Ionicons
              name="chevron-back"
              size={20}
              color="#2563EB"
              style={tw`mr-2`}
            />
          </AnimatedTouchable>
        );
      })}

      {/* If no companies match the search term */}
      {filteredItems.length === 0 && (
        <View style={tw`mt-10 items-center`}>
          <Ionicons name="search-outline" size={50} color="#999" />
          <Text style={tw`mt-2 text-gray-500 text-lg`}>לא נמצאו תוצאות</Text>
        </View>
      )}
    </ScrollView>
  );
}
