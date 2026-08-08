import { useTranslation } from 'react-i18next';
import type { Voivodeship } from '../constants/population';

export function useVoivodeshipLabel(voivodeship: Voivodeship): string {
  const { t } = useTranslation();
  return t(`voivodeships.${voivodeship.nameKey}`, { defaultValue: voivodeship.name });
}
