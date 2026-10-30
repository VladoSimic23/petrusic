import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Poveznica / gumb',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Tekst',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Poveznica',
      description: 'Npr. #projekti, /kontakt ili https://...',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
