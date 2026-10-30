import {SearchIcon} from '@sanity/icons/Search'
import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO naslov',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Preporuka je do 60 znakova.'),
    }),
    defineField({
      name: 'description',
      title: 'SEO opis',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Preporuka je do 160 znakova.'),
    }),
    defineField({
      name: 'image',
      title: 'Slika za dijeljenje (Open Graph)',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
})
