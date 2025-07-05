export interface Exercise {
  _id: string;
  _type: "exercise";
  name: string;
  description?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  };
  videoUrl?: string;
  isActive?: boolean;
}

export interface WorkoutSet {
  exercise: {
    _type: "reference";
    _ref: string; // Exercise document _id
  };
  reps: number;
  weight?: number;
  weightUnit: "lbs" | "kg";
  _key?: string;
}

export interface Workout {
  _id: string;
  _type: "workout";
  userId: string;
  date: string; // ISO string
  duration: number;
  sets: WorkoutSet[];
}

export interface WorkoutData {
  _type: string;
  userId: string;
  date: string;
  duration: number;
  sets: WorkoutSet[];
}
