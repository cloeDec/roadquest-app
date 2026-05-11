import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface Tab {
  key: string;
  label: string;
  icon: IconName;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.key)}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={20}
              color={isActive ? colors.brandPrimary : colors.textSecondary}
            />
            <Text
              variant="body"
              style={[styles.tabText, isActive && styles.tabTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  tabActive: {
    backgroundColor: colors.brandPrimary + "20",
  },
  tabText: {
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.brandPrimary,
    fontWeight: "600",
  },
});
