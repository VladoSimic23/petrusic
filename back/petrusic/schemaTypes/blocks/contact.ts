import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'Kontakt',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Nadnaslov',
      type: 'string',
      initialValue: 'Tu smo za vas',
    }),
    defineField({
      name: 'title',
      title: 'Naslov',
      type: 'string',
      initialValue: 'Razgovarajmo o vašem novom domu',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Uvodni tekst',
      type: 'text',
      rows: 3,
      initialValue:
        'Naš tim pomoći će vam pronaći odgovore i informacije o projektima koji vas zanimaju.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-mail adresa',
      type: 'email',
    }),
    defineField({
      name: 'phone',
      title: 'Broj telefona',
      description: 'Unesite broj s pozivnim brojem države, npr. +387...',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp broj',
      description: 'Unesite međunarodni broj s pozivnim brojem države.',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'viber',
      title: 'Viber broj',
      description: 'Unesite međunarodni broj s pozivnim brojem države.',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'address',
      title: 'Adresa',
      type: 'string',
    }),
    defineField({
      name: 'officeHours',
      title: 'Radno vrijeme',
      description: 'Možete unijeti i više redaka, npr. Pon–pet 08:00–16:00.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps embed URL',
      description:
        'U Google Mapsu odaberite Dijeli > Ugradi kartu > Kopiraj HTML pa zalijepite samo URL iz src="...". Primjer počinje s https://www.google.com/maps/embed?pb=...',
      type: 'url',
      validation: (rule) =>
        rule.uri({scheme: ['https']}).custom((value) => {
          if (!value) return true
          try {
            const url = new URL(value)
            return url.hostname === 'www.google.com' && url.pathname === '/maps/embed'
              ? true
              : 'Unesite URL ugrađene Google Maps karte (google.com/maps/embed).'
          } catch {
            return 'Unesite valjan URL ugrađene Google Maps karte.'
          }
        }),
    }),
    defineField({
      name: 'responseNote',
      title: 'Kratka napomena',
      description: 'Opcionalna poruka ispod kontaktnih podataka.',
      type: 'string',
      initialValue: 'Veselimo se vašem javljanju.',
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value || typeof value !== 'object') return true
      const channels = value as {
        email?: string
        phone?: string
        whatsapp?: string
        viber?: string
      }
      return channels.email || channels.phone || channels.whatsapp || channels.viber
        ? true
        : 'Unesite barem jedan kontaktni kanal: e-mail, telefon, WhatsApp ili Viber.'
    }),
  preview: {
    select: {title: 'title', email: 'email', phone: 'phone'},
    prepare: ({title, email, phone}) => ({
      title: title || 'Kontakt',
      subtitle: email || phone || 'Dodajte kontaktne podatke',
    }),
  },
})
