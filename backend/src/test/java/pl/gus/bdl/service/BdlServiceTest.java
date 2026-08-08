package pl.gus.bdl.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.gus.bdl.client.BdlApiClient;
import pl.gus.bdl.config.BdlApiProperties;
import pl.gus.bdl.dto.DataByVariableResponse;
import pl.gus.bdl.dto.PageResponse;
import pl.gus.bdl.dto.SubjectDto;
import pl.gus.bdl.dto.UnitDto;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BdlServiceTest {

    @Mock
    private BdlApiClient bdlApiClient;

    @Mock
    private BdlApiProperties properties;

    @InjectMocks
    private BdlService bdlService;

    @Test
    void getSubjectsUsesDefaultPageWhenNull() {
        when(properties.getDefaultPageSize()).thenReturn(20);
        PageResponse<SubjectDto> response = new PageResponse<>();
        when(bdlApiClient.getSubjects(null, 0, 20)).thenReturn(response);

        PageResponse<SubjectDto> result = bdlService.getSubjects(null, null);

        assertThat(result).isSameAs(response);
        verify(bdlApiClient).getSubjects(null, 0, 20);
    }

    @Test
    void getSubjectsPassesParentIdAndPage() {
        when(properties.getDefaultPageSize()).thenReturn(20);
        PageResponse<SubjectDto> response = new PageResponse<>();
        when(bdlApiClient.getSubjects("K3", 2, 20)).thenReturn(response);

        PageResponse<SubjectDto> result = bdlService.getSubjects("K3", 2);

        assertThat(result).isSameAs(response);
        verify(bdlApiClient).getSubjects("K3", 2, 20);
    }

    @Test
    void getDataByVariableDelegatesToClient() {
        DataByVariableResponse response = new DataByVariableResponse();
        List<Integer> years = List.of(2018, 2019);
        List<String> unitIds = List.of("071400000000");

        when(bdlApiClient.getDataByVariable(60641, years, unitIds)).thenReturn(response);

        DataByVariableResponse result = bdlService.getDataByVariable(60641, years, unitIds);

        assertThat(result).isSameAs(response);
        verify(bdlApiClient).getDataByVariable(60641, years, unitIds);
    }

    @Test
    void getUnitDelegatesToClient() {
        UnitDto unit = new UnitDto();
        unit.setId("071400000000");
        unit.setName("MAZOWIECKIE");

        when(bdlApiClient.getUnit("071400000000")).thenReturn(unit);

        UnitDto result = bdlService.getUnit("071400000000");

        assertThat(result.getName()).isEqualTo("MAZOWIECKIE");
    }
}
