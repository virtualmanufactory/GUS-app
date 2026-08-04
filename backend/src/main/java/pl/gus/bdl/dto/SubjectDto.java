package pl.gus.bdl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SubjectDto {

    private String id;
    private String name;
    private boolean hasVariables;
    private List<String> children;
    private List<Integer> levels;
    private String parentId;
}
