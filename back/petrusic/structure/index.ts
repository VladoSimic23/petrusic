import {HomeIcon} from '@sanity/icons/Home'
import {UsersIcon} from '@sanity/icons/Users'
import type {StructureResolver} from 'sanity/structure'

export const SINGLETON_TYPES = ['homePage', 'aboutPage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sadržaj')
    .items([
      S.listItem()
        .title('Naslovna')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Naslovna')),
      S.listItem()
        .title('O nama')
        .icon(UsersIcon)
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('O nama')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.includes(item.getId() ?? '')),
    ])
