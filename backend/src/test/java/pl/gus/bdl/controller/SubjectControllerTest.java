package pl.gus.bdl.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.gus.bdl.dto.PageResponse;
import pl.gus.bdl.dto.SubjectDto;
import pl.gus.bdl.service.BdlService;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SubjectController.class)
class SubjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BdlService bdlService;

    @Test
    void listReturnsSubjects() throws Exception {
        SubjectDto subject = new SubjectDto();
        subject.setId("K3");
        subject.setName("POPULATION");
        subject.setHasVariables(false);

        PageResponse<SubjectDto> page = new PageResponse<>();
        page.setTotalRecords(1);
        page.setPage(0);
        page.setPageSize(20);
        page.setResults(List.of(subject));

        when(bdlService.getSubjects(null, 0)).thenReturn(page);

        mockMvc.perform(get("/api/subjects").param("page", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRecords").value(1))
                .andExpect(jsonPath("$.results[0].id").value("K3"))
                .andExpect(jsonPath("$.results[0].name").value("POPULATION"));
    }

    @Test
    void getReturnsSubjectById() throws Exception {
        SubjectDto subject = new SubjectDto();
        subject.setId("K3");
        subject.setName("POPULATION");

        when(bdlService.getSubject("K3")).thenReturn(subject);

        mockMvc.perform(get("/api/subjects/K3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("K3"))
                .andExpect(jsonPath("$.name").value("POPULATION"));
    }
}
