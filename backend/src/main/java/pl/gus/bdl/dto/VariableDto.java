package pl.gus.bdl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class VariableDto {

    private int id;
    private String name;
    private String subjectId;
    private int level;
    private String measureUnitId;
    private List<Integer> years;
    private List<Integer> dimensions;
}
