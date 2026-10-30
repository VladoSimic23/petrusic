import {HomeIcon} from '@sanity/icons/Home'
import type {StructureResolver} from 'sanity/structure'

export const SINGLETON_TYPES = ['homePage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sadržaj')
    .items([
      S.listItem()
        .title('Naslovna')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Naslovna')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.includes(item.getId() ?? '')),
    ])
