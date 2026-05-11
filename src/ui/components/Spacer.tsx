import { View } from "react-native";
import { spacing, SpacingSize } from "../theme/spacing";

interface SpacerProps {
  size?: SpacingSize;
  horizontal?: boolean;
  flex?: boolean;
}

export function Spacer({ size = "md", horizontal = false, flex = false }: SpacerProps) {
  if (flex) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View
      style={{
        [horizontal ? "width" : "height"]: spacing[size],
      }}
    />
  );
}
