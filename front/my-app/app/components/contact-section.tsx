"use client";

import { useLanguage } from "./language-provider";
import { messagingNumber, phoneHref } from "./contact-utils";

type ContactChannel = "email" | "phone" | "whatsapp" | "viber";

export type ContactContent = {
  eyebrow?: string;
  title: string;
  description: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  viber?: string;
  address?: string;
  officeHours?: string;
  mapUrl?: string;
  responseNote?: string;
  english?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    address?: string;
    officeHours?: string;
    responseNote?: string;
  };
};

function ContactIcon({ channel }: { channel: ContactChannel }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="contact-section__channel-icon"
    >
      {channel === "email" ? (
        <path
          d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      ) : channel === "whatsapp" ? (
        <path
          d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z M9 9c.4 2.5 2 4.1 4.5 5l1-1 2 1c-.2 1.3-1.1 2-2.4 2-3.7-.5-6.5-3.3-7-7-.1-1.3.7-2.2 2-2.4l1 2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M7 3.8 10 3l2 4.6-2.1 1.8a14 14 0 0 0 4.7 4.7l1.8-2.1L21 14l-.8 3c-.3 1.1-1.4 1.8-2.5 1.6A17 17 0 0 1 5.4 6.3C5.2 5.2 5.9 4.1 7 3.8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function ContactSection({
  eyebrow = "Tu smo za vas",
  title,
  description,
  email,
  phone,
  whatsapp,
  viber,
  address,
  officeHours,
  mapUrl,
  responseNote,
  english,
}: ContactContent) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const addressText = isEnglish ? english?.address || address : address;
  const officeHoursText = isEnglish ? english?.officeHours || officeHours : officeHours;
  const channels = [
    email
      ? {
          channel: "email" as const,
          label: "E-mail",
          value: email,
          href: `mailto:${email}`,
        }
      : null,
    phone
      ? {
          channel: "phone" as const,
          label: isEnglish ? "Phone" : "Telefon",
          value: phone,
          href: phoneHref(phone),
        }
      : null,
    whatsapp
      ? {
          channel: "whatsapp" as const,
          label: "WhatsApp",
          value: whatsapp,
          href: `https://wa.me/${messagingNumber(whatsapp)}`,
          external: true,
        }
      : null,
    viber
      ? {
          channel: "viber" as const,
          label: "Viber",
          value: viber,
          href: `viber://chat?number=${encodeURIComponent(viber.replace(/[^\d+]/g, ""))}`,
        }
      : null,
  ].filter((channel) => channel !== null);

  return (
    <section
      className="content-section contact-section"
      id="kontakt"
      aria-labelledby="contact-title"
    >
      <div className="contact-section__frame">
        <div className="contact-section__intro">
          <p className="eyebrow eyebrow--dark">
            {isEnglish ? english?.eyebrow || eyebrow : eyebrow}
          </p>
          <h2 id="contact-title">{isEnglish ? english?.title || title : title}</h2>
          <p className="contact-section__description">
            {isEnglish ? english?.description || description : description}
          </p>
          {(isEnglish ? english?.responseNote || responseNote : responseNote) ? (
            <p className="contact-section__note">
              <span aria-hidden="true">✳</span>{" "}
              {isEnglish ? english?.responseNote || responseNote : responseNote}
            </p>
          ) : null}
          <div className="contact-section__index" aria-hidden="true">
            <span>PG</span>
            <span>Petrušić gradnja</span>
          </div>
        </div>

        <div className="contact-section__content">
          <p className="contact-section__label">
            {isEnglish ? "Choose how to contact us" : "Odaberite način javljanja"}
          </p>
          {channels.length ? (
            <div className="contact-section__channels">
              {channels.map(({ channel, label, value, href, ...options }) => (
                <a
                  className="contact-section__channel"
                  href={href}
                  key={channel}
                  target={options.external ? "_blank" : undefined}
                  rel={options.external ? "noopener noreferrer" : undefined}
                >
                  <span className="contact-section__channel-symbol">
                    <ContactIcon channel={channel} />
                  </span>
                  <span className="contact-section__channel-copy">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </span>
                  <span className="contact-section__channel-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="contact-section__empty">
              {isEnglish
                ? "We are currently updating our contact information. Thank you for your understanding."
                : "Trenutačno ažuriramo kontaktne podatke. Hvala na razumijevanju."}
            </p>
          )}

          {(addressText || officeHoursText) ? (
            <div className="contact-section__details">
              {addressText ? (
                <div className="contact-section__detail">
                  <span>{isEnglish ? "Visit us" : "Posjetite nas"}</span>
                  <strong>{addressText}</strong>
                </div>
              ) : null}
              {officeHoursText ? (
                <div className="contact-section__detail">
                  <span>{isEnglish ? "Office hours" : "Radno vrijeme"}</span>
                  <strong>{officeHoursText}</strong>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {mapUrl ? (
        <div className="contact-section__map">
          <div className="contact-section__map-heading">
            <div className="contact-section__map-copy">
              <span className="eyebrow eyebrow--dark">
                {isEnglish ? "Our location" : "Naša lokacija"}
              </span>
              <strong>
                {addressText ??
                  (isEnglish
                    ? "Petrušić gradnja headquarters"
                    : "Sjedište Petrušić gradnje")}
              </strong>
            </div>
          </div>
          <div className="contact-section__map-frame">
            <iframe
              src={mapUrl}
              title={
                addressText
                  ? `${isEnglish ? "Location map" : "Karta lokacije"}: ${addressText}`
                  : isEnglish
                    ? "Petrušić gradnja location"
                    : "Lokacija Petrušić gradnje"
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
