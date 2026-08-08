import { POPULATION_YEARS } from '../../constants/population';

interface Props {
  selectedYears: number[];
  onChange: (years: number[]) => void;
}

export default function YearFilter({ selectedYears, onChange }: Props) {
  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      onChange(selectedYears.filter((y) => y !== year));
    } else {
      onChange([...selectedYears, year].sort((a, b) => a - b));
    }
  };

  return (
    <aside className="year-filter">
      <h3>Lata</h3>
      <div className="year-filter-list">
        {POPULATION_YEARS.map((year) => (
          <label key={year} className="year-filter-item">
            <input
              type="checkbox"
              checked={selectedYears.includes(year)}
              onChange={() => toggleYear(year)}
            />
            <span>{year}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
