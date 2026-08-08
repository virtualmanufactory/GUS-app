package pl.gus.bdl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataByVariableResponse {

    private long totalRecords;
    private int variableId;
    private int measureUnitId;
    private Integer aggregateId;
    private List<DataResult> results;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DataResult {
        private String id;
        private String name;
        private List<DataValue> values;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DataValue {
        private String year;
        private Double val;
        private int attrId;
    }
}
