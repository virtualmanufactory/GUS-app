package pl.gus.bdl.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BdlApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RestClient bdlRestClient;

    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        mockServer = MockRestServiceServer.bindTo(bdlRestClient).build();
    }

    @Test
    void subjectsEndpointReturnsDataFromBdlApi() throws Exception {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/subjects?")))
                .andRespond(withSuccess(readFixture("fixtures/subjects-page.json"), MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/api/subjects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRecords").value(1))
                .andExpect(jsonPath("$.results[0].id").value("K3"))
                .andExpect(jsonPath("$.results[0].name").value("POPULATION"));

        mockServer.verify();
    }

    @Test
    void subjectByIdEndpointReturnsDataFromBdlApi() throws Exception {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/subjects/K3?")))
                .andRespond(withSuccess(readFixture("fixtures/subject-k3.json"), MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/api/subjects/K3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("K3"))
                .andExpect(jsonPath("$.name").value("POPULATION"));

        mockServer.verify();
    }

    @Test
    void dataByVariableEndpointReturnsDataFromBdlApi() throws Exception {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/data/by-variable/60641?")))
                .andRespond(withSuccess(readFixture("fixtures/data-by-variable.json"), MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/api/data/by-variable/60641").param("year", "2018"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variableId").value(60641))
                .andExpect(jsonPath("$.results[0].name").value("POLAND"))
                .andExpect(jsonPath("$.results[0].values[0].val").value(38411148));

        mockServer.verify();
    }

    @Test
    void aggregatesDictionaryEndpointReturnsDataFromBdlApi() throws Exception {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/aggregates?")))
                .andRespond(withSuccess(readFixture("fixtures/aggregates.json"), MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/api/dictionaries/aggregates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("TOTAL"))
                .andExpect(jsonPath("$[1].name").value("URBAN GMINAS"));

        mockServer.verify();
    }

    private String readFixture(String path) throws IOException {
        return new ClassPathResource(path).getContentAsString(StandardCharsets.UTF_8);
    }
}
