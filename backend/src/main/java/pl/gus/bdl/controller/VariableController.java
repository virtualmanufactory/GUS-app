package pl.gus.bdl.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.gus.bdl.dto.PageResponse;
import pl.gus.bdl.dto.VariableDto;
import pl.gus.bdl.service.BdlService;

@RestController
@RequestMapping("/api/variables")
@RequiredArgsConstructor
public class VariableController {

    private final BdlService bdlService;

    @GetMapping
    public PageResponse<VariableDto> list(
            @RequestParam(required = false) String subjectId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page) {
        return bdlService.getVariables(subjectId, search, page);
    }

    @GetMapping("/{id}")
    public VariableDto get(@PathVariable int id) {
        return bdlService.getVariable(id);
    }
}
