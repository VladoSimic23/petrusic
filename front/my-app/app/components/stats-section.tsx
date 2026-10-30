import CountUp from "./count-up";

export type StatsContent = {
  items: {
    _key: string;
    value: number;
    suffix?: string;
    label: string;
  }[];
};

export default function StatsSection({ items }: StatsContent) {
  if (!items.length) return null;

  return (
    <section className="stats-section" aria-label="Brojke i statistika">
      <ul className="stats-section__list">
        {items.map((item) => (
          <li className="stats-section__item" key={item._key}>
            <span className="stats-section__value">
              <CountUp value={item.value} suffix={item.suffix} />
            </span>
            <span className="stats-section__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
