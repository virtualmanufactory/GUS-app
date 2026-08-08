export interface IndustrySection {
  section: string;
  variableId: number;
  nameKey: string;
}

/** PKD NACE Rev.2 sections – number of persons employed (BDL subject P2869, level 3). */
export const EMPLOYMENT_SECTIONS: IndustrySection[] = [
  { section: 'B', variableId: 155678, nameKey: 'sectionB' },
  { section: 'C', variableId: 155654, nameKey: 'sectionC' },
  { section: 'D', variableId: 155554, nameKey: 'sectionD' },
  { section: 'E', variableId: 155550, nameKey: 'sectionE' },
  { section: 'F', variableId: 155530, nameKey: 'sectionF' },
  { section: 'G', variableId: 155472, nameKey: 'sectionG' },
  { section: 'H', variableId: 155517, nameKey: 'sectionH' },
  { section: 'I', variableId: 155493, nameKey: 'sectionI' },
  { section: 'J', variableId: 155462, nameKey: 'sectionJ' },
  { section: 'K', variableId: 1727692, nameKey: 'sectionK' },
  { section: 'L', variableId: 155418, nameKey: 'sectionL' },
  { section: 'M', variableId: 155414, nameKey: 'sectionM' },
  { section: 'N', variableId: 155386, nameKey: 'sectionN' },
  { section: 'P', variableId: 1727697, nameKey: 'sectionP' },
  { section: 'Q', variableId: 1727707, nameKey: 'sectionQ' },
  { section: 'R', variableId: 1727711, nameKey: 'sectionR' },
];

export const EMPLOYMENT_VARIABLE_IDS = EMPLOYMENT_SECTIONS.map((s) => s.variableId);

export const EMPLOYMENT_YEARS = Array.from({ length: 2022 - 2008 + 1 }, (_, i) => 2008 + i);

export const DEFAULT_EMPLOYMENT_YEAR = 2022;

export function getIndustrySection(variableId: number): IndustrySection | undefined {
  return EMPLOYMENT_SECTIONS.find((s) => s.variableId === variableId);
}
