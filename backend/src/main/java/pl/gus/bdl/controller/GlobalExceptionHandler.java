package pl.gus.bdl.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public ProblemDetail handleHttpClientError(HttpClientErrorException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(ex.getStatusCode());
        problem.setTitle("Błąd API BDL");
        problem.setDetail(ex.getResponseBodyAsString());
        return problem;
    }

    @ExceptionHandler(RestClientException.class)
    public ProblemDetail handleRestClientError(RestClientException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_GATEWAY);
        problem.setTitle("Błąd połączenia z API BDL");
        problem.setDetail(ex.getMessage());
        return problem;
    }
}
