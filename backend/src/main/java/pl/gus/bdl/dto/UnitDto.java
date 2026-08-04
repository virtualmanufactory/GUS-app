package pl.gus.bdl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UnitDto {

    private String id;
    private String name;
    private String parentId;
    private int level;
    private List<String> children;
}
