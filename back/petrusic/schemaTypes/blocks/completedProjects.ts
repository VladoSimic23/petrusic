import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const completedProjects = defineType({
  name: 'completedProjects',
  title: 'Izgrađeni objekti (reference)',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      type: 'string',
      initialValue: 'Naše reference',
    }),
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      initialValue: 'Izgrađeni objekti',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projects',
      title: 'Projekti',
      description: 'Odaberite do 3 samostalna dokumenta izgrađenih objekata.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'completedBuilding'}],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(3).unique(),
    }),
    defineField({
      name: 'viewAllLink',
      title: 'Poveznica na sve izgrađene objekte',
      type: 'callToAction',
      initialValue: {label: 'Pogledaj sve izgrađene objekte', href: '/izgradeni-objekti'},
    }),
  ],
  preview: {
    select: {title: 'title', projects: 'projects'},
    prepare: ({title, projects}) => ({
      title: title || 'Izgrađeni objekti (reference)',
      subtitle: Array.isArray(projects) ? `${projects.length} projekta` : undefined,
    }),
  },
})
