import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import type { PathOptions } from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { useEffect, useMemo, useState } from 'react';
import { extractUnitValue } from '../../api/bdlApi';
import {
  findVoivodeshipByGeoName,
  POLAND_BDL_ID,
  VOIVODESHIPS,
} from '../../constants/population';
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

export default function PolandMap({
  mapMetricData,
  selectedYear,
  selectedVoivodeshipId,
  onSelectVoivodeship,
}: Props) {
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
    const isSelected =
      voivodeship?.bdlId === selectedVoivodeshipId ||
      (!selectedVoivodeshipId && false);

    if (!voivodeship) {
      return { fillColor: '#cbd5e1', fillOpacity: 0.5, color: '#fff', weight: 1 };
    }

    const value = valueByVoivodeship.get(voivodeship.bdlId);
    const opacity =
      value != null && value > 0
        ? 0.55 + (value / Math.max(...Array.from(valueByVoivodeship.values()).filter(Boolean) as number[], 1)) * 0.35
        : 0.4;

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
    layer.bindTooltip(
      `<strong>${voivodeship.name}</strong><br/>${value?.toLocaleString('pl-PL') ?? 'brak danych'}`,
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
              key={`${selectedYear}-${selectedVoivodeshipId}-${mapMetricData?.variableId}`}
              data={geoJson}
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>

      <div className="voivodeship-list">
        <h3>Województwa</h3>
        <button
          type="button"
          className={`voivodeship-item ${!selectedVoivodeshipId ? 'active' : ''}`}
          onClick={() => onSelectVoivodeship(null)}
        >
          <span className="dot" style={{ background: '#64748b' }} />
          <span>Cała Polska</span>
        </button>
        {VOIVODESHIPS.map((voivodeship) => (
          <button
            key={voivodeship.bdlId}
            type="button"
            className={`voivodeship-item ${
              selectedVoivodeshipId === voivodeship.bdlId ? 'active' : ''
            }`}
            onClick={() => onSelectVoivodeship(voivodeship.bdlId)}
          >
            <span className="dot" style={{ background: voivodeship.color }} />
            <span>{voivodeship.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { POLAND_BDL_ID };
