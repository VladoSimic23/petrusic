import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AktualnostArticleView } from "../../components/aktualnosti-content";
import {
  getAktualnosti,
  getAktualnostBySlug,
} from "../../../sanity/lib/aktualnosti";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getAktualnosti();
  return items.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getAktualnostBySlug(slug);
  if (!item) return { title: "Aktualnost nije pronađena | Petrušić gradnja" };
  return {
    title: `${item.title} | Petrušić gradnja`,
    description: item.excerpt,
    alternates: { canonical: `/aktualnosti/${item.slug}` },
    openGraph: item.image ? { images: [item.image.src] } : undefined,
  };
}

export default function AktualnostPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <main className="news-article">
          <div
            className="project-detail__loading"
            aria-label="Učitavanje aktualnosti"
          />
        </main>
      }
    >
      <AktualnostContent params={params} />
    </Suspense>
  );
}

async function AktualnostContent({ params }: Props) {
  const { slug } = await params;
  const item = await getAktualnostBySlug(slug);
  if (!item) notFound();

  return <AktualnostArticleView item={item} />;
}