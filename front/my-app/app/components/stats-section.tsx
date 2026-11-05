import CountUp from "./count-up";
import { useLanguage } from "./language-provider";

export type StatsContent = {
  items: {
    _key: string;
    value: number;
    suffix?: string;
    label: string;
    labelEn?: string;
  }[];
};

export default function StatsSection({ items }: StatsContent) {
  const { language } = useLanguage();
  if (!items.length) return null;

  return (
    <section className="stats-section" aria-label="Brojke i statistika">
      <ul className="stats-section__list">
        {items.map((item) => (
          <li className="stats-section__item" key={item._key}>
            <span className="stats-section__value">
              <CountUp value={item.value} suffix={item.suffix} />
            </span>
            <span className="stats-section__label">
              {language === "en" ? item.labelEn || item.label : item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
