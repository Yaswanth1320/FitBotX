import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  description:
    "A record of a user's workout session, including sets performed, duration, and user reference.",
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      description: 'The Clerk user ID of the person who performed the workout.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'The date and time when the workout was performed.',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'Total duration of the workout in seconds.',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'sets',
      title: 'Sets',
      description: 'List of sets performed in this workout, with details for each.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'Reference to the exercise performed in this set.',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'reps',
              title: 'Repetitions',
              description: 'Number of repetitions performed in this set.',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'weight',
              title: 'Weight',
              description: 'Weight used for this set.',
              type: 'number',
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: 'weightUnit',
              title: 'Weight Unit',
              description: 'Unit of weight (lbs or kg) for this set.',
              type: 'string',
              options: {
                list: [
                  {title: 'Pounds (lbs)', value: 'lbs'},
                  {title: 'Kilograms (kg)', value: 'kg'},
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'userId',
      subtitle: 'date',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: `Workout by ${title}`,
        subtitle: subtitle ? new Date(subtitle).toLocaleString() : '',
      }
    },
  },
})
