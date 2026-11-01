import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'

const imageFields = [
  defineField({
    name: 'alt',
    title: 'Alternativni tekst',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'caption',
    title: 'Opis fotografije',
    type: 'string',
  }),
]

export const completedBuilding = defineType({
  name: 'completedBuilding',
  title: 'Izgrađeni objekt',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'basic', title: 'Osnovno', default: true},
    {name: 'facts', title: 'Podaci o objektu'},
    {name: 'media', title: 'Galerija'},
    {name: 'content', title: 'Opis'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Naziv objekta',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      description: 'Koristi se u adresi, npr. /izgradeni-objekti/naziv-objekta',
      type: 'slug',
      group: 'basic',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Lokacija',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kratki opis',
      description: 'Prikazuje se na karticama i ispod naslova na stranici objekta.',
      type: 'text',
      rows: 3,
      group: 'basic',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Glavna slika',
      type: 'image',
      group: 'basic',
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

    defineField({
      name: 'allSold',
      title: 'Svi stanovi prodani',
      description: 'Prikazuje oznaku „Svi stanovi prodani” na kartici i stranici objekta.',
      type: 'boolean',
      group: 'facts',
      initialValue: true,
    }),
    defineField({
      name: 'startYear',
      title: 'Godina početka gradnje',
      type: 'number',
      group: 'facts',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'completionYear',
      title: 'Godina završetka',
      type: 'number',
      group: 'facts',
      validation: (rule) => rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: 'apartmentCount',
      title: 'Broj izgrađenih stanova',
      type: 'number',
      group: 'facts',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'floors',
      title: 'Broj etaža',
      description: 'Slobodan tekst, npr. „Po + P + 4”.',
      type: 'string',
      group: 'facts',
    }),
    defineField({
      name: 'totalArea',
      title: 'Ukupna površina (m²)',
      type: 'number',
      group: 'facts',
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'parkingSpaces',
      title: 'Broj parkirnih mjesta',
      type: 'number',
      group: 'facts',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'highlights',
      title: 'Istaknute karakteristike',
      description: 'Kratke stavke, npr. „Lift”, „Energetski razred A”, „Podzemna garaža”.',
      type: 'array',
      group: 'facts',
      of: [defineArrayMember({type: 'string'})],
    }),

    defineField({
      name: 'gallery',
      title: 'Galerija slika',
      description: 'Fotografije objekta, interijera i okoliša.',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: imageFields,
        }),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Sadržaj stranice',
      description: 'Priča o objektu, izvedba, materijali i ostali detalji.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Odlomak', value: 'normal'},
            {title: 'Naslov sekcije', value: 'h2'},
            {title: 'Podnaslov', value: 'h3'},
            {title: 'Citat', value: 'blockquote'},
          ],
          lists: [
            {title: 'Grafička lista', value: 'bullet'},
            {title: 'Numerirana lista', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Podebljano', value: 'strong'},
              {title: 'Kurziv', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Poveznica',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: imageFields,
        }),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'location', media: 'image'},
  },
})
