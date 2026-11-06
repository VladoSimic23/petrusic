import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Naslovna',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Interni naziv',
      type: 'string',
      initialValue: 'Naslovna',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sekcije',
      type: 'array',
      of: [
        defineArrayMember({type: 'hero'}),
        defineArrayMember({type: 'stats'}),
        defineArrayMember({type: 'featuredProjects'}),
        defineArrayMember({type: 'completedProjects'}),
        defineArrayMember({type: 'about'}),
        defineArrayMember({type: 'standardKvaliteta'}),
        defineArrayMember({type: 'faq'}),
        defineArrayMember({type: 'contact'}),
      ],
      validation: (rule) =>
        rule.custom((sections) => {
          if (!Array.isArray(sections)) return true
          const heroes = sections.filter(
            (section) => (section as {_type?: string})._type === 'hero',
          ).length
          if (heroes > 1) return 'Dopuštena je samo jedna hero sekcija.'
          const contacts = sections.filter(
            (section) => (section as {_type?: string})._type === 'contact',
          ).length
          return contacts > 1 ? 'Dopuštena je samo jedna kontakt sekcija.' : true
        }),
    }),
    defineField({
        name: 'newsSection',
        title: 'Aktualnosti',
        type: 'newsSection',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'Naslovna', subtitle: 'Naslovna stranica'}),
  },
})
