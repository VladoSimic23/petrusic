import {BarChartIcon} from '@sanity/icons/BarChart'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const stats = defineType({
  name: 'stats',
  title: 'Brojke / statistika',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Brojke',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statItem',
          title: 'Brojka',
          fields: [
            defineField({
              name: 'value',
              title: 'Vrijednost',
              description: 'Samo broj, npr. 30',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'suffix',
              title: 'Nastavak',
              description: 'Npr. + ili %. Prikazuje se odmah iza broja.',
              type: 'string',
            }),
            defineField({
              name: 'label',
              title: 'Opis',
              description: 'Npr. godina iskustva',
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
      validation: (rule) => rule.required().min(2).max(4),
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare: ({items}) => ({
      title: 'Brojke / statistika',
      subtitle: Array.isArray(items) ? `${items.length} brojke` : undefined,
    }),
  },
})
