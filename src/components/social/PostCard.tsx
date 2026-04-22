import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text, Caption } from "@/src/ui/components/Text";
import { Card } from "@/src/ui/components/Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/src/ui/theme";
import type { RidePost } from "@/src/store/slices/socialSlice";

interface PostCardProps {
  post: RidePost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onProfilePress: (userId: string) => void;
}

export function PostCard({ post, onLike, onComment, onProfilePress }: PostCardProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const formatDistance = (km: number) => {
    return km >= 100 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `il y a ${diffMins}min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays < 7) return `il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <Card variant="elevated" padding="none" style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => onProfilePress(post.user_id)}
      >
        <View style={styles.avatar}>
          {post.author.avatar_url ? (
            <Image source={{ uri: post.author.avatar_url }} style={styles.avatarImage} />
          ) : (
            <MaterialCommunityIcons name="account" size={24} color={colors.white} />
          )}
        </View>
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text variant="body" bold>{post.author.username}</Text>
            <View style={styles.levelBadge}>
              <MaterialCommunityIcons name="star" size={10} color={colors.warning} />
              <Caption style={styles.levelText}>{post.author.level}</Caption>
            </View>
          </View>
          <Caption color="textSecondary">{formatDate(post.created_at)}</Caption>
        </View>
      </TouchableOpacity>

      {/* Photos */}
      {post.photos && post.photos.length > 0 && (
        <View style={styles.photosContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
              );
              setImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {post.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.photo}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {post.photos.length > 1 && (
            <View style={styles.photoIndicator}>
              <Caption style={styles.photoCount}>
                {imageIndex + 1}/{post.photos.length}
              </Caption>
            </View>
          )}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text variant="h3" style={styles.title}>
          {post.title}
        </Text>
        {post.description && (
          <Text variant="body" style={styles.description}>
            {post.description}
          </Text>
        )}

        {/* Ride Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={16}
              color={colors.brandPrimary}
            />
            <Caption>{formatDistance(post.distance_km)}</Caption>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={colors.brandPrimary}
            />
            <Caption>{formatDuration(post.duration_minutes)}</Caption>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(post.post_id)}
        >
          <MaterialCommunityIcons
            name={post.is_liked ? "heart" : "heart-outline"}
            size={24}
            color={post.is_liked ? colors.error : colors.textPrimary}
          />
          <Text variant="body" style={styles.actionText}>
            {post.likes_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment(post.post_id)}
        >
          <MaterialCommunityIcons
            name="comment-outline"
            size={24}
            color={colors.textPrimary}
          />
          <Text variant="body" style={styles.actionText}>
            {post.comments_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons
            name="share-variant"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  authorInfo: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "600",
  },
  photosContainer: {
    position: "relative",
  },
  photo: {
    width: 400, // Largeur fixe pour le scroll horizontal
    height: 300,
    backgroundColor: colors.backgroundSecondary,
  },
  photoIndicator: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  photoCount: {
    color: colors.white,
    fontSize: 12,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stats: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionText: {
    color: colors.textSecondary,
  },
});
