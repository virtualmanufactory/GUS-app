package pl.gus.bdl.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PageResponse<T> {

    private long totalRecords;
    private int page;
    private int pageSize;
    private Map<String, String> links;
    private List<T> results;
}
