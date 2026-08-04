package pl.gus.bdl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DataByVariableResponse {

    private int id;
    private String measureUnitId;
    private String measureUnitName;
    private List<Integer> years;
    private Map<String, List<Object>> values;
}
