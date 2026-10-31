import {UsersIcon} from '@sanity/icons/Users'
import {defineArrayMember, defineField, defineType} from 'sanity'

const titledTextItem = (name: string, title: string) =>
  defineArrayMember({
    type: 'object',
    name,
    title,
    fields: [
      defineField({
        name: 'title',
        title: 'Naslov',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'description',
        title: 'Opis',
        type: 'text',
        rows: 3,
        validation: (rule) => rule.required(),
      }),
    ],
    preview: {select: {title: 'title', subtitle: 'description'}},
  })

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'O nama',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'intro', title: 'Uvod', default: true},
    {name: 'story', title: 'Priča i brojke'},
    {name: 'values', title: 'Misija i vrijednosti'},
    {name: 'services', title: 'Djelatnosti'},
    {name: 'company', title: 'Podaci o tvrtki'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Interni naziv',
      type: 'string',
      initialValue: 'O nama',
      group: 'intro',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Mala oznaka iznad naslova',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'heading',
      title: 'Glavni naslov',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'highlightedHeading',
      title: 'Istaknuti dio naslova (zlatna boja)',
      type: 'string',
      group: 'intro',
    }),
    defineField({
      name: 'lead',
      title: 'Uvodni tekst',
      type: 'text',
      rows: 3,
      group: 'intro',
    }),
    defineField({
      name: 'heroImage',
      title: 'Naslovna slika',
      type: 'image',
      options: {hotspot: true},
      group: 'intro',
      fields: [
        defineField({name: 'alt', title: 'Alternativni tekst', type: 'string'}),
      ],
    }),

    defineField({
      name: 'storyTitle',
      title: 'Naslov priče',
      type: 'string',
      group: 'story',
    }),
    defineField({
      name: 'storyParagraphs',
      title: 'Odlomci priče',
      description: 'Svaka stavka je jedan odlomak.',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 4})],
      group: 'story',
    }),
    defineField({
      name: 'storyImage',
      title: 'Slika uz priču',
      type: 'image',
      options: {hotspot: true},
      group: 'story',
      fields: [
        defineField({name: 'alt', title: 'Alternativni tekst', type: 'string'}),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Brojke',
      type: 'array',
      group: 'story',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statItem',
          title: 'Brojka',
          fields: [
            defineField({
              name: 'value',
              title: 'Vrijednost',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'suffix',
              title: 'Nastavak',
              description: 'Npr. + ili %.',
              type: 'string',
            }),
            defineField({
              name: 'label',
              title: 'Opis',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {value: 'value', suffix: 'suffix', label: 'label'},
            prepare: ({value, suffix, label}) => ({
              title: `${value ?? ''}${suffix ?? ''}`,
              subtitle: label,
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),

    defineField({
      name: 'mission',
      title: 'Misija',
      type: 'text',
      rows: 4,
      group: 'values',
    }),
    defineField({
      name: 'vision',
      title: 'Vizija',
      type: 'text',
      rows: 4,
      group: 'values',
    }),
    defineField({
      name: 'reasonsTitle',
      title: 'Naslov sekcije „Zašto mi”',
      type: 'string',
      group: 'values',
    }),
    defineField({
      name: 'reasons',
      title: 'Razlozi za odabir',
      type: 'array',
      of: [titledTextItem('reason', 'Razlog')],
      group: 'values',
    }),

    defineField({
      name: 'servicesTitle',
      title: 'Naslov sekcije djelatnosti',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesIntro',
      title: 'Uvod u djelatnosti',
      type: 'text',
      rows: 3,
      group: 'services',
    }),
    defineField({
      name: 'services',
      title: 'Djelatnosti',
      type: 'array',
      of: [titledTextItem('service', 'Djelatnost')],
      group: 'services',
    }),

    defineField({
      name: 'companyName',
      title: 'Puni naziv',
      type: 'string',
      group: 'company',
    }),
    defineField({
      name: 'headquarters',
      title: 'Sjedište',
      type: 'string',
      group: 'company',
    }),
    defineField({
      name: 'jib',
      title: 'Identifikacijski broj (JIB)',
      type: 'string',
      group: 'company',
    }),
    defineField({
      name: 'vat',
      title: 'PDV broj',
      type: 'string',
      group: 'company',
    }),
    defineField({
      name: 'founded',
      title: 'Datum osnivanja',
      type: 'string',
      group: 'company',
    }),
    defineField({
      name: 'management',
      title: 'Uprava',
      type: 'string',
      group: 'company',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'O nama', subtitle: 'Podstranica O nama'}),
  },
})
