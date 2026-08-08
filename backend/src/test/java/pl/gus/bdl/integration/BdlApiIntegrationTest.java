package pl.gus.bdl.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(BdlApiIntegrationTest.MockRestClientTestConfig.class)
class BdlApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MockRestServiceServer mockServer;

    @TestConfiguration
    static class MockRestClientTestConfig {

        @Bean
        MockRestServiceServer mockRestServiceServer(RestClient.Builder bdlRestClientBuilder) {
            return MockRestServiceServer.bindTo(bdlRestClientBuilder).build();
        }
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
    void dataByVariableFetchesAllVoivodeshipsWhenUnitIdsProvided() throws Exception {
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/data/by-unit/000000000000?")))
                .andRespond(withSuccess(readFixture("fixtures/data-by-unit-poland.json"), MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/data/by-unit/011200000000?")))
                .andRespond(withSuccess(readFixture("fixtures/data-by-unit-malopolskie.json"), MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/data/by-unit/071400000000?")))
                .andRespond(withSuccess(readFixture("fixtures/data-by-unit-mazowieckie.json"), MediaType.APPLICATION_JSON));
        mockServer.expect(requestTo(org.hamcrest.Matchers.containsString("/data/by-unit/012400000000?")))
                .andRespond(withSuccess(readFixture("fixtures/data-by-unit-slaskie.json"), MediaType.APPLICATION_JSON));

        mockMvc.perform(get("/api/data/by-variable/60641")
                        .param("year", "2018")
                        .param("unitId", "000000000000")
                        .param("unitId", "011200000000")
                        .param("unitId", "071400000000")
                        .param("unitId", "012400000000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results", hasSize(4)))
                .andExpect(jsonPath("$.results[0].id").value("000000000000"))
                .andExpect(jsonPath("$.results[1].id").value("011200000000"))
                .andExpect(jsonPath("$.results[2].id").value("071400000000"))
                .andExpect(jsonPath("$.results[3].id").value("012400000000"));

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
