export const formatDurationSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};

export const formatDurationMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  }
  return `${mins}min`;
};

export const formatDistance = (km: number, precision: number = 1): string => {
  return `${km.toFixed(precision)} km`;
};

export const formatDateShort = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateLong = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `il y a ${diffMins}min`;
  }
  if (diffHours < 24) {
    return `il y a ${diffHours}h`;
  }
  if (diffDays < 7) {
    return `il y a ${diffDays}j`;
  }
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

export const formatTime = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).replace(":", "h");
};

export const calculateAverageSpeed = (
  distanceKm: number,
  durationSeconds: number
): number => {
  if (durationSeconds === 0) return 0;
  return distanceKm / (durationSeconds / 3600);
};
