import Restaurant from "@/components/restaurant/restaurant";
import { useLocalSearchParams } from "expo-router";

export default function OrdersRoute() {
  const { restaurant } = useLocalSearchParams();

  return (
    <Restaurant
        restaurantId={restaurant as string}
    />
  );
}



