package pl.gus.bdl.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.gus.bdl.dto.PageResponse;
import pl.gus.bdl.dto.UnitDto;
import pl.gus.bdl.service.BdlService;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class UnitController {

    private final BdlService bdlService;

    @GetMapping
    public PageResponse<UnitDto> list(
            @RequestParam(required = false) String parentId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page) {
        return bdlService.getUnits(parentId, search, page);
    }

    @GetMapping("/{id}")
    public UnitDto get(@PathVariable String id) {
        return bdlService.getUnit(id);
    }
}
