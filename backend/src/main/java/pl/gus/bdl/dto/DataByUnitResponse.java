package pl.gus.bdl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataByUnitResponse {

    private long totalRecords;
    private String unitId;
    private String unitName;
    private Integer aggregateId;
    private List<VariableResult> results;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VariableResult {
        private int id;
        private int measureUnitId;
        private List<DataByVariableResponse.DataValue> values;
    }
}
