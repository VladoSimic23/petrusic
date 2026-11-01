import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import { client } from "./client";

const FOOTER_CONTACT_QUERY = defineQuery(`*[_id == "homePage"][0]
  .sections[_type == "contact"][0]{
    email,
    phone,
    whatsapp,
    address,
    officeHours
  }`);

export type FooterContact = {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  officeHours?: string;
};

// Separate from getHomePage so the footer and the page never await the same in-flight cache entry.
export async function getFooterContact(): Promise<FooterContact> {
  "use cache";
  cacheLife("days");
  cacheTag("sanity", "homePage");

  const data = await client.fetch(FOOTER_CONTACT_QUERY);

  return {
    email: data?.email ?? undefined,
    phone: data?.phone ?? undefined,
    whatsapp: data?.whatsapp ?? undefined,
    address: data?.address ?? undefined,
    officeHours: data?.officeHours ?? undefined,
  };
}
