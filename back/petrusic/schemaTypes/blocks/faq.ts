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
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      initialValue: 'Česta pitanja',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Kratki uvod',
      description: 'Opcionalno. Prikazuje se uz naslov.',
      type: 'text',
      rows: 3,
    }),
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
            defineField({
              name: 'answer',
              title: 'Odgovor',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
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
        defineField({name: 'link', title: 'Poveznica', type: 'callToAction'}),
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
