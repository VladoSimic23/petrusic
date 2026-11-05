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
      name: 'image',
      title: 'Slika sekcije',
      description:
        'Široka panoramska slika (npr. gradilište ili zgrada u izgradnji). Preporuka: horizontalna, min. 2000 px širine.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativni tekst',
          type: 'string',
        }),
        defineField({
          name: 'caption',
          title: 'Natpis na slici',
          description: 'Kratki natpis u kutu slike, npr. „Gradilište Grude, 2026.”',
          type: 'string',
        }),
        defineField({name: 'englishAlt', title: 'English alt text', type: 'string'}),
        defineField({name: 'englishCaption', title: 'English caption', type: 'string'}),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Poveznica na stranicu O nama',
      type: 'callToAction',
      initialValue: {label: 'Više o nama', href: '/o-nama'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'english',
      title: 'English translation',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Company introduction', type: 'text', rows: 4}),
        defineField({
          name: 'cta',
          title: 'About page link',
          type: 'callToAction',
        }),
      ],
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
