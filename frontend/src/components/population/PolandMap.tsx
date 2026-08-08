import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import type { PathOptions } from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { extractUnitValue } from '../../api/bdlApi';
import {
  findVoivodeshipByGeoName,
  POLAND_BDL_ID,
  VOIVODESHIPS,
} from '../../constants/population';
import { useVoivodeshipLabel } from '../../hooks/useVoivodeshipLabel';
import type { DataByVariable } from '../../types/bdl';
import 'leaflet/dist/leaflet.css';

interface GeoProperties {
  name?: string;
  NAME_1?: string;
}

interface Props {
  mapMetricData: DataByVariable | null;
  selectedYear: number;
  selectedVoivodeshipId: string | null;
  onSelectVoivodeship: (id: string | null) => void;
}

function VoivodeshipListItem({
  voivodeship,
  isSelected,
  onSelect,
}: {
  voivodeship: (typeof VOIVODESHIPS)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const label = useVoivodeshipLabel(voivodeship);

  return (
    <button
      type="button"
      className={`voivodeship-item ${isSelected ? 'active' : ''}`}
      onClick={onSelect}
    >
      <span className="dot" style={{ background: voivodeship.color }} />
      <span>{label}</span>
    </button>
  );
}

export default function PolandMap({
  mapMetricData,
  selectedYear,
  selectedVoivodeshipId,
  onSelectVoivodeship,
}: Props) {
  const { t, i18n } = useTranslation();
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch('/geojson/wojewodztwa.geojson')
      .then((res) => res.json())
      .then(setGeoJson)
      .catch(() => setGeoJson(null));
  }, []);

  const valueByVoivodeship = useMemo(() => {
    const map = new Map<string, number | null>();
    if (!mapMetricData) return map;

    VOIVODESHIPS.forEach((voivodeship) => {
      map.set(
        voivodeship.bdlId,
        extractUnitValue(mapMetricData, voivodeship.bdlId, selectedYear),
      );
    });
    return map;
  }, [mapMetricData, selectedYear]);

  const styleFeature = (feature?: Feature<Geometry, GeoProperties>): PathOptions => {
    const voivodeship = findVoivodeshipByGeoName(
      feature?.properties?.name ?? feature?.properties?.NAME_1 ?? '',
    );
    const isSelected = voivodeship?.bdlId === selectedVoivodeshipId;

    if (!voivodeship) {
      return { fillColor: '#cbd5e1', fillOpacity: 0.5, color: '#fff', weight: 1 };
    }

    const value = valueByVoivodeship.get(voivodeship.bdlId);
    const maxValue = Math.max(
      ...(Array.from(valueByVoivodeship.values()).filter(Boolean) as number[]),
      1,
    );
    const opacity =
      value != null && value > 0 ? 0.55 + (value / maxValue) * 0.35 : 0.4;

    return {
      fillColor: voivodeship.color,
      fillOpacity: isSelected ? 0.95 : opacity,
      color: isSelected ? '#1e293b' : '#ffffff',
      weight: isSelected ? 2.5 : 1.2,
    };
  };

  const onEachFeature = (feature: Feature<Geometry, GeoProperties>, layer: L.Layer) => {
    const voivodeship = findVoivodeshipByGeoName(
      feature.properties?.name ?? feature.properties?.NAME_1 ?? '',
    );
    if (!voivodeship) return;

    const value = valueByVoivodeship.get(voivodeship.bdlId);
    const locale = i18n.language === 'en' ? 'en-US' : 'pl-PL';
    const displayName = t(`voivodeships.${voivodeship.nameKey}`, {
      defaultValue: voivodeship.name,
    });

    layer.bindTooltip(
      `<strong>${displayName}</strong><br/>${
        value?.toLocaleString(locale) ?? t('population.noMapData')
      }`,
    );

    layer.on({
      click: () => {
        onSelectVoivodeship(
          selectedVoivodeshipId === voivodeship.bdlId ? null : voivodeship.bdlId,
        );
      },
    });
  };

  return (
    <div className="map-panel">
      <div className="map-container">
        <MapContainer
          center={[52.07, 19.48]}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoJson && (
            <GeoJSON
              key={`${selectedYear}-${selectedVoivodeshipId}-${mapMetricData?.variableId}-${i18n.language}`}
              data={geoJson}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>

      <div className="voivodeship-list">
        <h3>{t('population.voivodeships')}</h3>
        <button
          type="button"
          className={`voivodeship-item ${!selectedVoivodeshipId ? 'active' : ''}`}
          onClick={() => onSelectVoivodeship(null)}
        >
          <span className="dot" style={{ background: '#64748b' }} />
          <span>{t('population.allPoland')}</span>
        </button>
        {VOIVODESHIPS.map((voivodeship) => (
          <VoivodeshipListItem
            key={voivodeship.bdlId}
            voivodeship={voivodeship}
            isSelected={selectedVoivodeshipId === voivodeship.bdlId}
            onSelect={() => onSelectVoivodeship(voivodeship.bdlId)}
          />
        ))}
      </div>
    </div>
  );
}

export { POLAND_BDL_ID };
