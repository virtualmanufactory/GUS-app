package pl.gus.bdl.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import pl.gus.bdl.dto.DataByUnitResponse;
import pl.gus.bdl.dto.DataByVariableResponse;
import pl.gus.bdl.dto.PageResponse;
import pl.gus.bdl.dto.SubjectDto;
import pl.gus.bdl.dto.UnitDto;
import pl.gus.bdl.dto.VariableDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class BdlApiClient {

    private static final int DATA_PAGE_SIZE = 100;

    private final RestClient.Builder restClientBuilder;
    private RestClient restClient;

    public BdlApiClient(RestClient.Builder bdlRestClientBuilder) {
        this.restClientBuilder = bdlRestClientBuilder;
    }

    private RestClient restClient() {
        if (restClient == null) {
            restClient = restClientBuilder.build();
        }
        return restClient;
    }

    public PageResponse<SubjectDto> getSubjects(String parentId, int page, int pageSize) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/subjects")
                .queryParam("format", "json")
                .queryParam("page", page)
                .queryParam("page-size", pageSize);

        if (parentId != null && !parentId.isBlank()) {
            builder.queryParam("parent-id", parentId);
        }

        return get(builder.toUriString(), new ParameterizedTypeReference<>() {});
    }

    public SubjectDto getSubject(String id) {
        return get("/subjects/{id}?format=json", SubjectDto.class, id);
    }

    public PageResponse<VariableDto> getVariables(String subjectId, String search, int page, int pageSize) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/variables")
                .queryParam("format", "json")
                .queryParam("page", page)
                .queryParam("page-size", pageSize);

        if (subjectId != null && !subjectId.isBlank()) {
            builder.queryParam("subject-id", subjectId);
        }
        if (search != null && !search.isBlank()) {
            builder.queryParam("name", search);
        }

        return get(builder.toUriString(), new ParameterizedTypeReference<>() {});
    }

    public VariableDto getVariable(int id) {
        return get("/variables/{id}?format=json", VariableDto.class, id);
    }

    public PageResponse<UnitDto> getUnits(String parentId, String search, int page, int pageSize) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/units")
                .queryParam("format", "json")
                .queryParam("page", page)
                .queryParam("page-size", pageSize);

        if (parentId != null && !parentId.isBlank()) {
            builder.queryParam("parent-id", parentId);
        }
        if (search != null && !search.isBlank()) {
            builder.queryParam("name", search);
        }

        return get(builder.toUriString(), new ParameterizedTypeReference<>() {});
    }

    public UnitDto getUnit(String id) {
        return get("/units/{id}?format=json", UnitDto.class, id);
    }

    public DataByVariableResponse getDataByVariable(int variableId, List<Integer> years, List<String> unitIds) {
        if (unitIds == null || unitIds.isEmpty()) {
            return fetchDataByVariablePage(variableId, years, null, 0);
        }

        List<DataByVariableResponse.DataResult> collected = new ArrayList<>();
        DataByVariableResponse merged = new DataByVariableResponse();
        merged.setVariableId(variableId);

        for (String unitId : unitIds) {
            DataByUnitResponse unitResponse = fetchDataByUnit(unitId, List.of(variableId), years);
            if (unitResponse.getResults() == null || unitResponse.getResults().isEmpty()) {
                continue;
            }

            DataByUnitResponse.VariableResult variableResult = unitResponse.getResults().get(0);
            DataByVariableResponse.DataResult result = new DataByVariableResponse.DataResult();
            result.setId(unitResponse.getUnitId());
            result.setName(unitResponse.getUnitName());
            result.setValues(variableResult.getValues());
            collected.add(result);

            if (merged.getMeasureUnitId() == 0) {
                merged.setMeasureUnitId(variableResult.getMeasureUnitId());
            }
            merged.setAggregateId(unitResponse.getAggregateId());
        }

        merged.setResults(collected);
        merged.setTotalRecords(collected.size());
        return merged;
    }

    private DataByUnitResponse fetchDataByUnit(String unitId, List<Integer> variableIds, List<Integer> years) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/data/by-unit/{id}")
                .queryParam("format", "json");

        if (variableIds != null) {
            variableIds.forEach(varId -> builder.queryParam("var-id", varId));
        }
        if (years != null) {
            years.forEach(year -> builder.queryParam("year", year));
        }

        return get(builder.buildAndExpand(unitId).toUriString(), DataByUnitResponse.class);
    }

    private DataByVariableResponse fetchDataByVariablePage(
            int variableId,
            List<Integer> years,
            List<String> unitIds,
            int page) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/data/by-variable/{id}")
                .queryParam("format", "json")
                .queryParam("page", page)
                .queryParam("page-size", DATA_PAGE_SIZE);

        if (years != null) {
            years.forEach(year -> builder.queryParam("year", year));
        }
        if (unitIds != null) {
            unitIds.forEach(unitId -> builder.queryParam("unit-id", unitId));
        }

        return get(builder.buildAndExpand(variableId).toUriString(), DataByVariableResponse.class);
    }

    public Map<String, Object> getDataByUnit(String unitId, List<Integer> variableIds, List<Integer> years) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/data/by-unit/{id}")
                .queryParam("format", "json");

        if (variableIds != null) {
            variableIds.forEach(varId -> builder.queryParam("var-id", varId));
        }
        if (years != null) {
            years.forEach(year -> builder.queryParam("year", year));
        }

        return get(builder.buildAndExpand(unitId).toUriString(), new ParameterizedTypeReference<>() {});
    }

    public List<Map<String, Object>> getAggregates() {
        Map<String, Object> response = get("/aggregates?format=json", new ParameterizedTypeReference<>() {});
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
        return results;
    }

    public List<Map<String, Object>> getYears() {
        Map<String, Object> response = get("/years?format=json", new ParameterizedTypeReference<>() {});
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
        return results;
    }

    public List<Map<String, Object>> getMeasures() {
        Map<String, Object> response = get("/measures?format=json", new ParameterizedTypeReference<>() {});
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
        return results;
    }

    public List<Map<String, Object>> getLevels() {
        Map<String, Object> response = get("/levels?format=json", new ParameterizedTypeReference<>() {});
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
        return results;
    }

    private <T> T get(String uri, Class<T> responseType, Object... uriVars) {
        return restClient().get()
                .uri(uri, uriVars)
                .retrieve()
                .body(responseType);
    }

    private <T> T get(String uri, ParameterizedTypeReference<T> responseType, Object... uriVars) {
        return restClient().get()
                .uri(uri, uriVars)
                .retrieve()
                .body(responseType);
    }
}
