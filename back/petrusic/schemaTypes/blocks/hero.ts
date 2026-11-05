import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      description: 'Mali tekst iznad naslova.',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Naslov',
      description: 'Prvi dio naslova (bijela boja).',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'highlightedTitle',
      title: 'Istaknuti dio naslova',
      description: 'Drugi dio naslova, prikazan u naglašenoj boji u novom redu.',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Opis',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'primaryCta',
      title: 'Glavni gumb',
      type: 'callToAction',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Pozadinska slika',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternativni tekst',
          description: 'Ostavite prazno ako je slika samo dekorativna.',
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stat',
      title: 'Istaknuti podatak',
      type: 'object',
      fields: [
        defineField({name: 'value', title: 'Vrijednost', description: 'Npr. 30', type: 'string'}),
        defineField({name: 'label', title: 'Opis', description: 'Npr. godina iskustva', type: 'string'}),
      ],
    }),
    defineField({
      name: 'footerNote',
      title: 'Poruka u podnožju',
      type: 'string',
    }),
    defineField({
      name: 'scrollLink',
      title: 'Poveznica za pomicanje',
      description: 'Npr. "Otkrijte više" koja vodi na sljedeću sekciju.',
      type: 'callToAction',
    }),
    defineField({
      name: 'english',
      title: 'English translation',
      type: 'object',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'highlightedTitle', title: 'Highlighted title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'primaryCta', title: 'Primary button', type: 'callToAction'}),
        defineField({
          name: 'stat',
          title: 'Featured statistic',
          type: 'object',
          fields: [
            defineField({name: 'value', title: 'Value', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
        }),
        defineField({name: 'footerNote', title: 'Footer note', type: 'string'}),
        defineField({name: 'scrollLink', title: 'Scroll link', type: 'callToAction'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'highlightedTitle', media: 'backgroundImage'},
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Hero',
        subtitle: subtitle ? `Hero · ${subtitle}` : 'Hero',
        media: media ?? ImageIcon,
      }
    },
  },
})
