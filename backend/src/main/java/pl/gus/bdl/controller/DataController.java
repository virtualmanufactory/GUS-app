package pl.gus.bdl.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.gus.bdl.dto.DataByVariableResponse;
import pl.gus.bdl.service.BdlService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
@RequiredArgsConstructor
public class DataController {

    private final BdlService bdlService;

    @GetMapping("/by-variable/{variableId}")
    public DataByVariableResponse getByVariable(
            @PathVariable int variableId,
            @RequestParam(required = false) List<Integer> year,
            @RequestParam(required = false) List<String> unitId) {
        return bdlService.getDataByVariable(variableId, year, unitId);
    }

    @GetMapping("/by-unit/{unitId}")
    public Map<String, Object> getByUnit(
            @PathVariable String unitId,
            @RequestParam(required = false) List<Integer> varId,
            @RequestParam(required = false) List<Integer> year) {
        return bdlService.getDataByUnit(unitId, varId, year);
    }
}
