import { describe, expect, it } from 'vitest';
import {
  EMPLOYMENT_SECTIONS,
  EMPLOYMENT_VARIABLE_IDS,
  getIndustrySection,
} from './employment';

describe('EMPLOYMENT_SECTIONS', () => {
  it('contains unique section codes and variable ids', () => {
    const sections = EMPLOYMENT_SECTIONS.map((s) => s.section);
    const variableIds = EMPLOYMENT_SECTIONS.map((s) => s.variableId);

    expect(new Set(sections).size).toBe(sections.length);
    expect(new Set(variableIds).size).toBe(variableIds.length);
    expect(EMPLOYMENT_VARIABLE_IDS).toHaveLength(EMPLOYMENT_SECTIONS.length);
  });

  it('finds section by variable id', () => {
    expect(getIndustrySection(155530)?.section).toBe('F');
  });
});
