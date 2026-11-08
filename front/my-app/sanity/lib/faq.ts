import type { FaqContent } from "../../app/components/faq-section";

export type FaqQueryData =
  | {
      eyebrow: string | null;
      title: string | null;
      description: string | null;
      items:
        | {
            _key: string;
            question: string | null;
            answer: string | null;
            questionEn: string | null;
            answerEn: string | null;
          }[]
        | null;
      cta: {
        text: string | null;
        textEn: string | null;
        link: { label: string | null; href: string | null } | null;
        linkLabelEn: string | null;
      } | null;
      eyebrowEn: string | null;
      titleEn: string | null;
      descriptionEn: string | null;
    }
  | null
  | undefined;

export function mapFaq(block: FaqQueryData): FaqContent | undefined {
  if (!block?.title) return undefined;

  const items = (block.items ?? []).flatMap((item) =>
    item.question && item.answer
      ? [{ _key: item._key, question: item.question, answer: item.answer }]
      : [],
  );
  if (!items.length) return undefined;

  const link = block.cta?.link;
  const englishItems = (block.items ?? []).map((item) => ({
    _key: item._key,
    question: item.questionEn ?? undefined,
    answer: item.answerEn ?? undefined,
  }));
  return {
    eyebrow: block.eyebrow ?? undefined,
    title: block.title,
    description: block.description ?? undefined,
    items,
    cta:
      link?.label && link.href
        ? {
            text: block.cta?.text ?? undefined,
            link: { label: link.label, href: link.href },
          }
        : undefined,
    english: {
      eyebrow: block.eyebrowEn ?? undefined,
      title: block.titleEn ?? undefined,
      description: block.descriptionEn ?? undefined,
      items: englishItems,
      cta: {
        text: block.cta?.textEn ?? undefined,
        linkLabel: block.cta?.linkLabelEn ?? undefined,
      },
    },
  };
}
