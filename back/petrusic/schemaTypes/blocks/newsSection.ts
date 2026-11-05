import { defineField, defineType } from 'sanity'

export const newsSection = defineType({
  name: 'newsSection',
  title: 'Aktualnosti',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      type: 'string',
      initialValue: 'Novosti',
    }),
    defineField({ name: 'eyebrowEn', title: 'Nadnaslov (English)', type: 'string' }),
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      initialValue: 'Aktualnosti',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'titleEn', title: 'Naslov (English)', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Opis',
      type: 'text',
      rows: 2,
    }),
    defineField({ name: 'descriptionEn', title: 'Opis (English)', type: 'text', rows: 2 }),
    defineField({
      name: 'viewAllLabel',
      title: 'Tekst poveznice na sve aktualnosti',
      type: 'string',
      initialValue: 'Sve aktualnosti',
    }),
    defineField({
      name: 'viewAllLabelEn',
      title: 'Tekst poveznice na sve aktualnosti (English)',
      type: 'string',
    }),
    defineField({
      name: 'articles',
      title: 'Aktualnosti na naslovnici',
      description: 'Odaberite do 3 aktualnosti i povucite ih za promjenu redoslijeda.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'aktualnost' }],
        },
      ],
      validation: (rule) => rule.max(3).unique(),
    }),
  ],
  preview: {
    select: { title: 'title', articles: 'articles' },
    prepare: ({ title, articles }) => ({
      title: title || 'Aktualnosti',
      subtitle: `${Array.isArray(articles) ? articles.length : 0} odabranih objava`,
    }),
  },
})
