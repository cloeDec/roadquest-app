import React from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/src/ui";
import { colors, spacing, borderRadius } from "@/src/ui/theme";

interface PlaceSuggestion {
  properties: {
    id: string;
    name: string;
    label: string;
    country: string;
    locality?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  suggestions: PlaceSuggestion[];
  showSuggestions: boolean;
  onSelectPlace: (place: PlaceSuggestion) => void;
  onClear: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  suggestions,
  showSuggestions,
  onSelectPlace,
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textTertiary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Où voulez-vous aller ?"
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.properties.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  onSelectPlace(item);
                  Keyboard.dismiss();
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.textTertiary}
                  style={styles.suggestionIcon}
                />
                <View style={styles.suggestionText}>
                  <Text variant="body" style={styles.mainText}>
                    {item.properties.name}
                  </Text>
                  <Text variant="caption" color="textTertiary">
                    {item.properties.locality
                      ? `${item.properties.locality}, ${item.properties.country}`
                      : item.properties.country}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 60,
    left: spacing.md,
    right: 72,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: spacing.xs,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 300,
  },
  list: {
    flexGrow: 0,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundPrimary,
  },
  suggestionIcon: {
    marginRight: spacing.sm,
  },
  suggestionText: {
    flex: 1,
  },
  mainText: {
    fontWeight: "500",
  },
});
