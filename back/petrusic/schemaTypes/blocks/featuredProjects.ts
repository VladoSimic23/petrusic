import {ThLargeIcon} from '@sanity/icons/ThLarge'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const featuredProjects = defineType({
  name: 'featuredProjects',
  title: 'Aktualni projekti (kartice)',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      type: 'string',
      initialValue: 'Pronađite svoj novi dom',
    }),
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      initialValue: 'Aktualni projekti',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'projects',
      title: 'Projekti',
      description:
        'Odaberite zgrade koje se trenutno prodaju ili grade. Slabe reference omogućuju povlačenje ili brisanje projekta bez blokiranja.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'project'}],
          weak: true,
        }),
      ],
      validation: (rule) => rule.required().min(1).max(3).unique(),
    }),
    defineField({
      name: 'cardCtaLabel',
      title: 'Tekst gumba na kartici',
      type: 'string',
      initialValue: 'Pregledaj tlocrte',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'viewAllLink',
      title: 'Poveznica na sve projekte',
      type: 'callToAction',
      initialValue: {label: 'Svi dostupni projekti', href: '/prodaja-stanova'},
    }),
    defineField({
      name: 'english',
      title: 'English translation',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'cardCtaLabel', title: 'Project button label', type: 'string'}),
        defineField({
          name: 'viewAllLink',
          title: 'Link to all projects',
          type: 'callToAction',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', projects: 'projects'},
    prepare: ({title, projects}) => ({
      title: title || 'Aktualni projekti (kartice)',
      subtitle: Array.isArray(projects) ? `${projects.length} projekta` : undefined,
    }),
  },
})
