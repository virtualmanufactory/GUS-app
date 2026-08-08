package pl.gus.bdl.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pl.gus.bdl.dto.DataByVariableResponse;
import pl.gus.bdl.service.BdlService;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DataController.class)
class DataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BdlService bdlService;

    @Test
    void getByVariableReturnsData() throws Exception {
        DataByVariableResponse.DataValue value = new DataByVariableResponse.DataValue();
        value.setYear("2018");
        value.setVal(38411148.0);
        value.setAttrId(1);

        DataByVariableResponse.DataResult result = new DataByVariableResponse.DataResult();
        result.setId("000000000000");
        result.setName("POLAND");
        result.setValues(List.of(value));

        DataByVariableResponse response = new DataByVariableResponse();
        response.setVariableId(60641);
        response.setResults(List.of(result));

        when(bdlService.getDataByVariable(60641, List.of(2018), null)).thenReturn(response);

        mockMvc.perform(get("/api/data/by-variable/60641").param("year", "2018"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variableId").value(60641))
                .andExpect(jsonPath("$.results[0].name").value("POLAND"))
                .andExpect(jsonPath("$.results[0].values[0].val").value(38411148));
    }
}
