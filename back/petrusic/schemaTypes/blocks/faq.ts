import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'Česta pitanja (FAQ)',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      type: 'string',
      initialValue: 'Imate pitanja?',
    }),
    defineField({name: 'eyebrowEn', title: 'Nadnaslov (English)', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      initialValue: 'Česta pitanja',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'titleEn', title: 'Naslov (English)', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Kratki uvod',
      description: 'Opcionalno. Prikazuje se uz naslov.',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'descriptionEn', title: 'Kratki uvod (English)', type: 'text', rows: 3}),
    defineField({
      name: 'items',
      title: 'Pitanja',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Pitanje',
          fields: [
            defineField({
              name: 'question',
              title: 'Pitanje',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'questionEn', title: 'Pitanje (English)', type: 'string'}),
            defineField({
              name: 'answer',
              title: 'Odgovor',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answerEn',
              title: 'Odgovor (English)',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({
      name: 'cta',
      title: 'Poziv na kontakt',
      description: 'Opcionalno. Prikazuje se ispod pitanja.',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Tekst',
          type: 'string',
          initialValue: 'Niste pronašli odgovor?',
        }),
        defineField({name: 'textEn', title: 'Tekst (English)', type: 'string'}),
        defineField({name: 'link', title: 'Poveznica', type: 'callToAction'}),
        defineField({name: 'linkLabelEn', title: 'Tekst poveznice (English)', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare: ({title, items}) => ({
      title: title || 'Česta pitanja (FAQ)',
      subtitle: Array.isArray(items) ? `${items.length} pitanja` : undefined,
    }),
  },
})
