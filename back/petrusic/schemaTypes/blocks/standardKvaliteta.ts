import {defineField, defineType} from 'sanity'

export const standardSchema = defineType({
  name: 'standard',
  title: 'Standardi i kvaliteta gradnje',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: 'Redni broj ili oznaka',
      type: 'string',
      description: 'Npr. "01", "02" ili "A+"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Naslov standarda',
      type: 'string',
      description: 'Npr. "Zvučna izolacija", "Trostruka ALU stolarija"',
      validation: (Rule) => Rule.required().min(3).max(60),
    }),
    defineField({
      name: 'titleEn',
      title: 'Naslov standarda (English)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'description',
      title: 'Kratki opis',
      type: 'text',
      rows: 3,
      description: 'Kratki opis tehnologije ili prednosti za kupca (1-2 rečenice).',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Kratki opis (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'order',
      title: 'Poredak prikazivanja',
      type: 'number',
      description: 'Odredite redoslijed kartica (1, 2, 3...)',
      initialValue: 1,
    }),
  ],
  orderings: [
    {
      title: 'Redoslijed prikaza',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      number: 'number',
    },
    prepare({title, subtitle, number}) {
      return {
        title: `${number ?? ''} - ${title ?? 'Bez naslova'}`,
        subtitle: subtitle,
      }
    },
  },
})

export const standardKvaliteta = defineType({
  name: 'standardKvaliteta',
  title: 'Standardi i kvaliteta',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      type: 'string',
      initialValue: 'Naši standardi',
    }),
    defineField({name: 'eyebrowEn', title: 'Nadnaslov (English)', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Naslov sekcije',
      type: 'string',
      initialValue: 'Standardi i kvaliteta gradnje',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'titleEn', title: 'Naslov sekcije (English)', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Opis sekcije',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'descriptionEn', title: 'Opis sekcije (English)', type: 'text', rows: 3}),
    defineField({
      name: 'standards',
      title: 'Standardi',
      description: 'Odaberite standarde i povucite ih za promjenu redoslijeda.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'standard'}],
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: {title: 'title', standards: 'standards'},
    prepare: ({title, standards}) => ({
      title: title || 'Standardi i kvaliteta',
      subtitle: `${Array.isArray(standards) ? standards.length : 0} standarda`,
    }),
  },
})
