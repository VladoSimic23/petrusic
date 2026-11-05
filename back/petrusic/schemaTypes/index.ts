import {hero} from './blocks/hero'
import {featuredProjects} from './blocks/featuredProjects'
import {completedProjects} from './blocks/completedProjects'
import {about} from './blocks/about'
import {faq} from './blocks/faq'
import {contact} from './blocks/contact'
import {newsSection} from './blocks/newsSection'
import {stats} from './blocks/stats'
import {homePage} from './documents/homePage'
import {aboutPage} from './documents/aboutPage'
import {project} from './documents/project'
import {completedBuilding} from './documents/completedBuilding'
import {callToAction} from './objects/callToAction'
import {seo} from './objects/seo'
import {aktualnostSchema} from './documents/aktualnosti'

export const schemaTypes = [
  homePage,
  aboutPage,
  project,
  aktualnostSchema,
  completedBuilding,
  hero,
  stats,
  featuredProjects,
  completedProjects,
  about,
  faq,
  contact,
  newsSection,
  callToAction,
  seo,
]
