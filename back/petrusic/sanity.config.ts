import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SINGLETON_TYPES, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'petrusic',

  projectId: 'rltga4eg',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETON_TYPES.includes(schemaType)),
  },

  document: {
    actions: (input, {schemaType}) =>
      SINGLETON_TYPES.includes(schemaType)
        ? input.filter(
            ({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
})
