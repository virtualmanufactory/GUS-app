import i18n from '../i18n';

describe('i18n', () => {
  it('has Polish and English translations', () => {
    expect(i18n.t('nav.home', { lng: 'pl' })).toBe('Start');
    expect(i18n.t('nav.home', { lng: 'en' })).toBe('Home');
  });

  it('translates population dashboard title', () => {
    expect(i18n.t('population.title', { lng: 'pl' })).toContain('Populacja');
    expect(i18n.t('population.title', { lng: 'en' })).toContain('Population');
  });
});
