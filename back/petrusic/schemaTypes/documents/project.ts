import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projekt u prodaji',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Naziv zgrade',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      description: 'Koristi se u adresi projekta, npr. /prodaja-stanova/naziv-zgrade',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Lokacija',
      description: 'Npr. Zagreb, Trešnjevka',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'completion',
      title: 'Rok završetka',
      description: 'Slobodan tekst, npr. "Q4 2026" ili "Lipanj 2027."',
      type: 'string',
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
    defineField({
      name: 'gallery',
      title: 'Galerija slika',
      description: 'Dodajte fotografije zgrade, interijera i okoliša.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
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
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Sadržaj stranice',
      description:
        'Uredite opis zgrade, standard gradnje i dodatne informacije. Fotografije možete umetnuti izravno u tekst.',
      type: 'array',
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
          fields: [
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
          ],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'location', media: 'image'},
  },
})
