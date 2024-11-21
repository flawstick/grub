import React from "react";
import { TouchableOpacity as TouchableBase } from "react-native";
import * as Haptics from "expo-haptics";

export const TouchableImpact = React.forwardRef<
  typeof TouchableBase,
  React.ComponentProps<typeof TouchableBase> & {
    impact?: boolean | Haptics.ImpactFeedbackStyle;
  }
>(({ onPressIn, impact = true, ...props }, ref) => {
  return (
    <TouchableBase
      activeOpacity={0.8}
      onPressIn={(...props) => {
        if (impact && process.env.EXPO_OS !== "web") {
          Haptics.impactAsync(
            impact === true ? Haptics.ImpactFeedbackStyle.Light : impact,
          );
        }
        onPressIn?.(...props);
      }}
      {...props}
    />
  );
});
