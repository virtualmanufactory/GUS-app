# GusCompanyFinder

Aplikacja do przeglądania danych **Banku Danych Lokalnych GUS** (BDL).

- **Backend:** Spring Boot 3.4 (Java 17) — proxy do [API BDL](https://api.stat.gov.pl/Home/BdlApi)
- **Frontend:** React 19 + TypeScript + Vite

## Wymagania

- Java 17+
- Maven 3.9+
- Node.js 20+

## Konfiguracja klucza API

Zarejestruj się na [portalu API GUS](https://api.stat.gov.pl/Home/BdlApi) i uzyskaj klucz API.

```bash
# Windows (PowerShell)
$env:BDL_CLIENT_ID="twoj-klucz-api"

# Linux/macOS
export BDL_CLIENT_ID="twoj-klucz-api"
```

Alternatywnie skopiuj `backend/src/main/resources/application-local.properties.example` jako `application-local.properties` i uzupełnij klucz.

## Uruchomienie

### Backend (port 8080)

```bash
cd backend
mvn spring-boot:run
```

### Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Aplikacja dostępna pod adresem: http://localhost:5173

# Testy

## Backend (JUnit 5 + MockMvc)

```bash
cd backend
mvn test
```

- **Jednostkowe:** `BdlServiceTest`, `SubjectControllerTest`
- **Integracyjne:** `BdlApiIntegrationTest` (MockRestServiceServer + pełny kontekst Spring)

## Frontend (Vitest + Testing Library)

```bash
cd frontend
npm test
```

- **Jednostkowe:** `bdlApi.test.ts`, `population.test.ts`, `AppLogo.test.tsx`, `YearFilter.test.tsx`
- **Integracyjne:** `HomePage.integration.test.tsx`

W aplikacji dostępne są dwa języki interfejsu: **polski** i **angielski**. Przełącznik znajduje się w nagłówku (oraz na dashboardzie populacji). Wybór jest zapisywany w `localStorage`.

Pliki tłumaczeń: `frontend/src/i18n/locales/pl.json`, `frontend/src/i18n/locales/en.json`

Dashboard populacji (mapa + wykresy): http://localhost:5173/population

## Struktura projektu

```
gus/
├── backend/                    # Spring Boot
│   ├── src/main/java/pl/gus/bdl/
│   │   ├── config/             # Konfiguracja (CORS, RestClient, properties)
│   │   ├── client/             # Klient HTTP do API BDL
│   │   ├── controller/         # REST API (/api/subjects, /api/variables, ...)
│   │   ├── dto/                # Modele odpowiedzi BDL
│   │   └── service/            # Logika biznesowa
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React + Vite
│   └── src/
│       ├── api/                # Warstwa komunikacji z backendem
│       ├── components/         # Komponenty UI
│       ├── pages/                # Strony (tematy, zmienne, jednostki, dane)
│       └── types/              # Typy TypeScript
└── README.md
```

## Endpointy backendu

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/subjects` | Lista tematów |
| GET | `/api/subjects/{id}` | Szczegóły tematu |
| GET | `/api/variables` | Lista zmiennych |
| GET | `/api/variables/{id}` | Szczegóły zmiennej |
| GET | `/api/units` | Jednostki terytorialne |
| GET | `/api/units/{id}` | Szczegóły jednostki |
| GET | `/api/data/by-variable/{id}` | Dane dla zmiennej |
| GET | `/api/data/by-unit/{id}` | Dane dla jednostki |
| GET | `/api/dictionaries/*` | Słowniki (lata, agregaty, poziomy) |

## Licencja danych

Dane BDL udostępniane są na licencji [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode.pl).
