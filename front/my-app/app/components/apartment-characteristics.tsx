"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ApartmentCharacteristic } from "../../sanity/lib/projects";
import { useLanguage } from "./language-provider";

export default function ApartmentCharacteristics({
  apartments,
  projectTitle,
  englishProjectTitle,
}: {
  apartments: ApartmentCharacteristic[];
  projectTitle: string;
  englishProjectTitle?: string;
}) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageDialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const imageCloseRef = useRef<HTMLButtonElement>(null);
  const imageTriggerRef = useRef<HTMLButtonElement>(null);
  const imageOpenRef = useRef(false);
  const displayProjectTitle = isEnglish
    ? englishProjectTitle || projectTitle
    : projectTitle;
  const activeApartment =
    activeIndex === null ? undefined : apartments[activeIndex];
  const isDialogOpen = activeIndex !== null;

  useEffect(() => {
    imageOpenRef.current = isImageOpen;
  }, [isImageOpen]);

  useEffect(() => {
    const dialog = imageDialogRef.current;
    if (!dialog || !isImageOpen) return;

    dialog.showModal();
    imageCloseRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [isImageOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isDialogOpen) return;

    dialog.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        if (imageOpenRef.current) return;
        setActiveIndex((index) =>
          index === null ? index : (index + 1) % apartments.length,
        );
      }
      if (event.key === "ArrowLeft") {
        if (imageOpenRef.current) return;
        setActiveIndex((index) =>
          index === null ? index : (index - 1 + apartments.length) % apartments.length,
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      if (dialog.open) dialog.close();
    };
  }, [isDialogOpen, apartments.length]);

  useEffect(() => {
    if (isImageOpen) imageCloseRef.current?.focus();
    else imageTriggerRef.current?.focus();
  }, [isImageOpen]);

  const labels = isEnglish
    ? {
        eyebrow: "Apartment selection",
        title: "Find the right home",
        bedrooms: "Bedrooms",
        bathrooms: "Bathrooms & WC",
        rooms: "Rooms",
        area: "Total area",
        location: "Location",
        close: "Close apartment details",
        closeImage: "Close full-size image",
        enlargeImage: "Click to view full size",
        previous: "Previous apartment",
        next: "Next apartment",
        available: "apartment types",
        bedroom: "bedroom",
        bedroomsPlural: "bedrooms",
        cardType: "Type",
        availabilityAvailable: "Available",
        availabilityUnavailable: "Unavailable",
      }
    : {
        eyebrow: "Ponuda stanova",
        title: "Odaberite stan po svojoj mjeri",
        bedrooms: "Spavaće sobe",
        bathrooms: "Kupatila i WC",
        rooms: "Prostorije",
        area: "Ukupna površina",
        location: "Lokacija",
        close: "Zatvori detalje stana",
        closeImage: "Zatvori sliku",
        enlargeImage: "Kliknite za prikaz pune veličine",
        previous: "Prethodni stan",
        next: "Sljedeći stan",
        available: "tipova stanova",
        bedroom: "spavaća soba",
        bedroomsPlural: "spavaćih soba",
        cardType: "Tip",
        availabilityAvailable: "Dostupno",
        availabilityUnavailable: "Nedostupno",
      };

  const apartmentType = (apartment: ApartmentCharacteristic) =>
    (isEnglish ? apartment.apartmentTypeEn : apartment.apartmentType) ||
    apartment.apartmentType ||
    apartment.apartmentTypeEn ||
    "";

  return (
    <section className="apartment-options" aria-labelledby="apartment-options-title">
      <div className="project-detail__wrap">
        <header className="apartment-options__heading">
          <div className="apartment-options__heading-copy">
            <p className="eyebrow eyebrow--dark">{labels.eyebrow}</p>
            <h2 id="apartment-options-title">{labels.title}</h2>
            <p>
              {displayProjectTitle}
              {isEnglish
                ? " — explore the available apartment options."
                : " — pregledajte dostupne opcije stanova."}
            </p>
          </div>
          <div className="apartment-options__summary" aria-label={`${apartments.length} ${labels.available}`}>
            <span>{String(apartments.length).padStart(2, "0")}</span>
            <span>{labels.available}</span>
          </div>
        </header>

        <ul className="apartment-options__grid">
          {apartments.map((apartment, index) => (
            <li key={apartment._key}>
              <button
                className="apartment-option"
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-haspopup="dialog"
                aria-label={`${apartment.availability === "available" ? labels.availabilityAvailable : labels.availabilityUnavailable}. ${isEnglish ? "Type" : "Tip"} ${index + 1}${apartmentType(apartment) ? `: ${apartmentType(apartment)}` : ""}${apartment.totalArea != null ? `, ${labels.area}: ${apartment.totalArea} m²` : ""}${apartment.bedrooms != null ? `, ${labels.bedrooms}: ${apartment.bedrooms}` : ""}`}
              >
                <span className="apartment-option__topline">
                  <span className="apartment-option__type-label">
                    {labels.cardType} {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="apartment-option__arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
                <span className="apartment-option__center-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`apartment-option__availability${apartment.availability === "unavailable" ? " apartment-option__availability--unavailable" : ""}`}
                >
                  {apartment.availability === "available"
                    ? labels.availabilityAvailable
                    : labels.availabilityUnavailable}
                </span>
                {apartment.totalArea != null || apartment.bedrooms != null ? (
                  <span className="apartment-option__details">
                    {apartment.totalArea != null ? (
                      <span>{apartment.totalArea} m²</span>
                    ) : null}
                    {apartment.bedrooms != null ? (
                      <span>
                        {apartment.bedrooms}{" "}
                        {apartment.bedrooms === 1
                          ? labels.bedroom
                          : labels.bedroomsPlural}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeApartment ? (
        <dialog
          className="apartment-detail-dialog"
          ref={dialogRef}
          aria-labelledby="apartment-dialog-title"
          onClick={(event) => {
            if (event.target === dialogRef.current) setActiveIndex(null);
          }}
          onClose={() => setActiveIndex(null)}
        >
          <div className="apartment-detail-dialog__top">
            <p className="eyebrow">
              {isEnglish ? "Apartment" : "Stan"}{" "}
              {String((activeIndex ?? 0) + 1).padStart(2, "0")} /{" "}
              {String(apartments.length).padStart(2, "0")}
            </p>
            <button
              className="apartment-detail-dialog__close"
              type="button"
              aria-label={labels.close}
              ref={closeRef}
              onClick={() => setActiveIndex(null)}
            >
              ×
            </button>
          </div>
          <div className="apartment-detail-dialog__content">
            <div className="apartment-detail-dialog__visual">
              {activeApartment.image ? (
                <button
                  className="apartment-detail-dialog__image-button"
                  type="button"
                  ref={imageTriggerRef}
                  aria-haspopup="dialog"
                  onClick={() => setIsImageOpen(true)}
                >
                  <Image
                    src={activeApartment.image.src}
                    alt={
                      (isEnglish
                        ? activeApartment.image.altEn
                        : activeApartment.image.alt) ||
                      apartmentType(activeApartment) ||
                      displayProjectTitle
                    }
                    fill
                    sizes="(max-width: 760px) 100vw, 55vw"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                  <span>{labels.enlargeImage} <span aria-hidden="true">⤢</span></span>
                </button>
              ) : (
                <span aria-hidden="true">PG</span>
              )}
            </div>
            <div className="apartment-detail-dialog__details">
              <p className="eyebrow eyebrow--dark">
                {isEnglish ? "Type" : "Tip"} {(activeIndex ?? 0) + 1}
              </p>
              <h2 id="apartment-dialog-title">
                {apartmentType(activeApartment) ||
                  `${isEnglish ? "Apartment" : "Stan"} ${(activeIndex ?? 0) + 1}`}
              </h2>
              <dl className="apartment-card__details">
                {activeApartment.bedrooms != null ? (
                  <div>
                    <dt>{labels.bedrooms}</dt>
                    <dd>
                      {activeApartment.bedrooms}{" "}
                      {isEnglish
                        ? activeApartment.bedrooms === 1
                          ? labels.bedroom
                          : labels.bedroomsPlural
                        : activeApartment.bedrooms === 1
                          ? "spavaća soba"
                          : labels.bedroomsPlural}
                    </dd>
                  </div>
                ) : null}
                {(isEnglish
                  ? activeApartment.bathroomsAndWcEn ||
                    activeApartment.bathroomsAndWc
                  : activeApartment.bathroomsAndWc) ? (
                  <div>
                    <dt>{labels.bathrooms}</dt>
                    <dd>
                      {isEnglish
                        ? activeApartment.bathroomsAndWcEn ||
                          activeApartment.bathroomsAndWc
                        : activeApartment.bathroomsAndWc}
                    </dd>
                  </div>
                ) : null}
                {(isEnglish
                  ? activeApartment.roomsEn || activeApartment.rooms
                  : activeApartment.rooms) ? (
                  <div>
                    <dt>{labels.rooms}</dt>
                    <dd>
                      {isEnglish
                        ? activeApartment.roomsEn || activeApartment.rooms
                        : activeApartment.rooms}
                    </dd>
                  </div>
                ) : null}
                {activeApartment.totalArea != null ? (
                  <div>
                    <dt>{labels.area}</dt>
                    <dd>{activeApartment.totalArea} m²</dd>
                  </div>
                ) : null}
                {(isEnglish
                  ? activeApartment.locationEn || activeApartment.location
                  : activeApartment.location) ? (
                  <div>
                    <dt>{labels.location}</dt>
                    <dd>
                      {isEnglish
                        ? activeApartment.locationEn || activeApartment.location
                        : activeApartment.location}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
          {apartments.length > 1 ? (
            <footer className="apartment-detail-dialog__footer">
              <button
                type="button"
                aria-label={labels.previous}
                onClick={() =>
                  setActiveIndex(
                    ((activeIndex ?? 0) - 1 + apartments.length) % apartments.length,
                  )
                }
              >
                ← <span>{labels.previous}</span>
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={() =>
                  setActiveIndex(((activeIndex ?? 0) + 1) % apartments.length)
                }
              >
                <span>{labels.next}</span> →
              </button>
            </footer>
          ) : null}
        </dialog>
      ) : null}
      {activeApartment?.image && isImageOpen
        ? createPortal(
            <dialog
              className="apartment-image-dialog"
              ref={imageDialogRef}
              aria-label={labels.enlargeImage}
              onClick={(event) => {
                if (event.target === event.currentTarget) setIsImageOpen(false);
              }}
              onCancel={(event) => {
                  event.preventDefault();
                  setIsImageOpen(false);
              }}
            >
              <button
                className="apartment-image-dialog__close"
                type="button"
                aria-label={labels.closeImage}
                ref={imageCloseRef}
                onClick={() => setIsImageOpen(false)}
              >
                ×
              </button>
              <div className="apartment-image-dialog__image">
                <Image
                  src={activeApartment.image.src}
                  alt={
                    (isEnglish
                      ? activeApartment.image.altEn
                      : activeApartment.image.alt) ||
                    apartmentType(activeApartment) ||
                    displayProjectTitle
                  }
                  fill
                  sizes="100vw"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </section>
  );
}
