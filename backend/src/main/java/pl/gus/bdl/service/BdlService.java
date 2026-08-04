package pl.gus.bdl.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.gus.bdl.client.BdlApiClient;
import pl.gus.bdl.config.BdlApiProperties;
import pl.gus.bdl.dto.DataByVariableResponse;
import pl.gus.bdl.dto.PageResponse;
import pl.gus.bdl.dto.SubjectDto;
import pl.gus.bdl.dto.UnitDto;
import pl.gus.bdl.dto.VariableDto;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BdlService {

    private final BdlApiClient bdlApiClient;
    private final BdlApiProperties properties;

    public PageResponse<SubjectDto> getSubjects(String parentId, Integer page) {
        return bdlApiClient.getSubjects(parentId, pageOrDefault(page), properties.getDefaultPageSize());
    }

    public SubjectDto getSubject(String id) {
        return bdlApiClient.getSubject(id);
    }

    public PageResponse<VariableDto> getVariables(String subjectId, String search, Integer page) {
        return bdlApiClient.getVariables(subjectId, search, pageOrDefault(page), properties.getDefaultPageSize());
    }

    public VariableDto getVariable(int id) {
        return bdlApiClient.getVariable(id);
    }

    public PageResponse<UnitDto> getUnits(String parentId, String search, Integer page) {
        return bdlApiClient.getUnits(parentId, search, pageOrDefault(page), properties.getDefaultPageSize());
    }

    public UnitDto getUnit(String id) {
        return bdlApiClient.getUnit(id);
    }

    public DataByVariableResponse getDataByVariable(int variableId, List<Integer> years, List<String> unitIds) {
        return bdlApiClient.getDataByVariable(variableId, years, unitIds);
    }

    public Map<String, Object> getDataByUnit(String unitId, List<Integer> variableIds, List<Integer> years) {
        return bdlApiClient.getDataByUnit(unitId, variableIds, years);
    }

    public List<Map<String, Object>> getAggregates() {
        return bdlApiClient.getAggregates();
    }

    public List<Map<String, Object>> getYears() {
        return bdlApiClient.getYears();
    }

    public List<Map<String, Object>> getMeasures() {
        return bdlApiClient.getMeasures();
    }

    public List<Map<String, Object>> getLevels() {
        return bdlApiClient.getLevels();
    }

    private int pageOrDefault(Integer page) {
        return page != null ? page : 0;
    }
}
