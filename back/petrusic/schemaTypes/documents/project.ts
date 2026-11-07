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
      name: 'description',
      title: 'Kratki opis projekta',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'apartmentCharacteristics',
      title: 'Stanovi i njihove karakteristike',
      description:
        'Dodajte jedan item za svaki stan. Svaki stan ima vlastite podatke i opcionalnu sliku.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'apartmentCharacteristicsItem',
          title: 'Stan',
          fields: [
            defineField({
              name: 'apartmentType',
              title: 'Tip stana',
              description: 'Npr. Trosoban stan',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'apartmentTypeEn',
              title: 'Tip stana (English)',
              type: 'string',
            }),
            defineField({
              name: 'availability',
              title: 'Dostupnost',
              description: 'Odaberite je li stan dostupan za kupnju.',
              type: 'string',
              options: {
                list: [
                  {title: 'Dostupno', value: 'available'},
                  {title: 'Nedostupno', value: 'unavailable'},
                ],
                layout: 'radio',
              },
              initialValue: 'available',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'bedrooms',
              title: 'Broj spavaćih soba',
              type: 'number',
              validation: (rule) => rule.integer().min(0),
            }),
            defineField({
              name: 'bathroomsAndWc',
              title: 'Kupatila i WC',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'bathroomsAndWcEn',
              title: 'Kupatila i WC (English)',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'rooms',
              title: 'Prostorije',
              description: 'Npr. hodnik, dnevni boravak, kuhinja i balkon.',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'roomsEn',
              title: 'Prostorije (English)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'totalArea',
              title: 'Ukupna površina (m²)',
              type: 'number',
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: 'location',
              title: 'Lokacija',
              type: 'string',
            }),
            defineField({
              name: 'locationEn',
              title: 'Lokacija (English)',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Slika stana (opcionalno)',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternativni tekst',
                  type: 'string',
                }),
                defineField({
                  name: 'altEn',
                  title: 'Alternativni tekst (English)',
                  type: 'string',
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'apartmentType', subtitle: 'totalArea', media: 'image'},
            prepare({title, subtitle, media}) {
              return {
                title: title || 'Stan',
                subtitle: subtitle != null ? `${subtitle} m²` : undefined,
                media,
              };
            },
          },
        }),
      ],
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
        defineField({name: 'englishAlt', title: 'English alt text', type: 'string'}),
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
            defineField({name: 'englishAlt', title: 'English alt text', type: 'string'}),
            defineField({name: 'englishCaption', title: 'English caption', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'english',
      title: 'English translation',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Building name', type: 'string'}),
        defineField({name: 'location', title: 'Location', type: 'string'}),
        defineField({name: 'completion', title: 'Completion date', type: 'string'}),
        defineField({name: 'description', title: 'Project introduction', type: 'text', rows: 3}),
        defineField({
          name: 'body',
          title: 'Page content',
          description: 'English version of the project description and other page content.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'block',
              styles: [
                {title: 'Paragraph', value: 'normal'},
                {title: 'Section heading', value: 'h2'},
                {title: 'Subheading', value: 'h3'},
                {title: 'Quote', value: 'blockquote'},
              ],
              lists: [
                {title: 'Bulleted list', value: 'bullet'},
                {title: 'Numbered list', value: 'number'},
              ],
              marks: {
                decorators: [
                  {title: 'Bold', value: 'strong'},
                  {title: 'Italic', value: 'em'},
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
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
                defineField({name: 'alt', title: 'Alternative text', type: 'string'}),
                defineField({name: 'caption', title: 'Image caption', type: 'string'}),
              ],
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
