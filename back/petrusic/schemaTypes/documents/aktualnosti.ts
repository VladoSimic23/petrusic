import {defineField, defineType} from 'sanity'

export const aktualnostSchema = defineType({
  name: 'aktualnost',
  title: 'Aktualnosti i novosti',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(120),
    }),
    defineField({
      name: 'titleEn',
      title: 'Naslov (English)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL adresa)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Datum objave',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategorija',
      type: 'string',
      options: {
        list: [
          {title: 'Napredak gradnje', value: 'napredak-gradnje'},
          {title: 'Standardi i kvaliteta', value: 'standardi-kvaliteta'},
          {title: 'Obavijesti i milestones', value: 'obavijesti'},
          {title: 'Savjeti za uređenje', value: 'savjeti'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoryEn',
      title: 'Kategorija (English)',
      type: 'string',
      description: 'Npr. Construction progress, Quality standards, Announcements ili Interior tips.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Glavna slika (Cover)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt tekst (Opis slike)',
          type: 'string',
        }),
        defineField({
          name: 'altEn',
          title: 'Alt tekst (English)',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Kratki sažetak (Excerpt)',
      type: 'text',
      rows: 3,
      description: 'Kratki opis koji se prikazuje na kartici članka na početnoj stranici.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'excerptEn',
      title: 'Kratki sažetak (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Sadržaj članka',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt tekst',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Opis ispod slike (Caption)',
              type: 'string',
            }),
            defineField({ name: 'altEn', title: 'Alt tekst (English)', type: 'string' }),
            defineField({
              name: 'captionEn',
              title: 'Opis ispod slike (English)',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'bodyEn',
      title: 'Sadržaj članka (English)',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({ name: 'alt', title: 'Alt tekst (English)', type: 'string' }),
            defineField({
              name: 'caption',
              title: 'Opis ispod slike (English)',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'readingTime',
      title: 'Procijenjeno vrijeme čitanja',
      type: 'string',
      description: 'Npr. "2 min čitanja"',
    }),
    defineField({
      name: 'readingTimeEn',
      title: 'Procijenjeno vrijeme čitanja (English)',
      type: 'string',
      description: 'Npr. "2 min read"',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare({title, category, media, date}) {
      return {
        title: title ?? 'Bez naslova',
        subtitle: `${category ? category.replace('-', ' ') : 'Nema kategorije'} — ${
          date ? new Date(date).toLocaleDateString('hr-HR') : ''
        }`,
        media,
      }
    },
  },
})
