import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'

export const completedBuilding = defineType({
  name: 'completedBuilding',
  title: 'Izgrađeni objekt',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Naziv objekta',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Lokacija',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'completionYear',
      title: 'Godina završetka',
      type: 'number',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'apartmentCount',
      title: 'Broj izgrađenih stanova',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kratki opis',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Glavna slika',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativni tekst',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'location', media: 'image'},
  },
})
