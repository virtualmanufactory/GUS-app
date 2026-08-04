package pl.gus.bdl.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.gus.bdl.service.BdlService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dictionaries")
@RequiredArgsConstructor
public class DictionaryController {

    private final BdlService bdlService;

    @GetMapping("/aggregates")
    public List<Map<String, Object>> getAggregates() {
        return bdlService.getAggregates();
    }

    @GetMapping("/years")
    public List<Map<String, Object>> getYears() {
        return bdlService.getYears();
    }

    @GetMapping("/measures")
    public List<Map<String, Object>> getMeasures() {
        return bdlService.getMeasures();
    }

    @GetMapping("/levels")
    public List<Map<String, Object>> getLevels() {
        return bdlService.getLevels();
    }
}
