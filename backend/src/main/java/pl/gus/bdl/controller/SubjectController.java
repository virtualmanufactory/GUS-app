package pl.gus.bdl.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.gus.bdl.dto.PageResponse;
import pl.gus.bdl.dto.SubjectDto;
import pl.gus.bdl.service.BdlService;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final BdlService bdlService;

    @GetMapping
    public PageResponse<SubjectDto> list(
            @RequestParam(required = false) String parentId,
            @RequestParam(required = false) Integer page) {
        return bdlService.getSubjects(parentId, page);
    }

    @GetMapping("/{id}")
    public SubjectDto get(@PathVariable String id) {
        return bdlService.getSubject(id);
    }
}
