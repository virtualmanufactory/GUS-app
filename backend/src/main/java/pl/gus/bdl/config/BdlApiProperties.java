package pl.gus.bdl.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "bdl.api")
public class BdlApiProperties {

    private String baseUrl = "https://bdl.stat.gov.pl/api/v1";
    private String clientId;
    private int defaultPageSize = 20;
}
