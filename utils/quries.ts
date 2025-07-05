import { defineQuery } from "groq";

export const exercisesQuery = defineQuery(`*[_type == "exercise"]`);

export const singleExerciseQuery = defineQuery(
  `*[_type == "exercise" && _id == $id][0]`
);

export const getWorkoutsQuery =
  defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
  _id,
  date,
  duration,
  sets[] {
    exercise-> {
      _id,
      name
    },
    reps,
    weight,
    weightUnit,
    _type,
    _key
  },
  _type,
  _key
}`);

export const getWorkoutRecordQuery =
  defineQuery(`*[_type == "workout" && _id == $workoutId][0] {
  _id,
  _type,
  _createdAt,
  date,
  duration,
  sets[] {
    reps,
    weight,
    weightUnit,
    _type,
    _key,
    exercise-> {
      _id,
      name,
      description
    }
  }
}`);

export const findExerciseQuery =
  defineQuery(`*[_type == "exercise" && name == $name][0] {
  _id,
  name
}`);
