import {UserIcon} from '@sanity/icons/User'
import {defineField, defineType} from 'sanity'

export const about = defineType({
  name: 'about',
  title: 'O nama (naslovna sekcija)',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      type: 'string',
      initialValue: 'Petrušić gradnja',
    }),
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      initialValue: 'Gradimo domove za generacije',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Kratki opis tvrtke',
      description: 'Kratak uvod koji se prikazuje na naslovnoj stranici.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Poveznica na stranicu O nama',
      type: 'callToAction',
      initialValue: {label: 'Više o nama', href: '/o-nama'},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: title || 'O nama (naslovna sekcija)',
      subtitle: 'Uvod u tvrtku',
    }),
  },
})
