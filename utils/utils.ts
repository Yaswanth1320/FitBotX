export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    if (remainingSeconds > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${hours}h`;
    }
  } else {
    if (remainingSeconds > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m`;
    }
  }
}

export const getTotalSets = (workout: any) => {
  return Array.isArray(workout?.sets) ? workout.sets.length : 0;
};

export const getExerciseNames = (workout: any) => {
  if (!workout.sets) return [];

  const names = workout.sets
    .map((set: any) => set.exercise?.name)
    .filter(Boolean);

  return Array.from(new Set(names));
};

export const getTotalVolume = (workout: any) => {
  if (!workout?.sets) return { volume: 0, unit: "lbs" };
  return workout.sets.reduce(
    (acc: { volume: number; unit: string }, set: any) => {
      if (set.weight && set.reps) {
        return {
          volume: acc.volume + set.weight * set.reps,
          unit: set.weightUnit || acc.unit || "lbs",
        };
      }
      return acc;
    },
    { volume: 0, unit: "lbs" }
  );
};

export const formatTime = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
