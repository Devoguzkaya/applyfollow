package com.applyfollow.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
                String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                                .map(FieldError::getDefaultMessage)
                                .findFirst()
                                .orElse("Validation failed");

                ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, errorMessage);
                problemDetail.setTitle("Validation Failed");

                List<Map<String, String>> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                                .map(err -> Map.of("field", err.getField(), "error", err.getDefaultMessage()))
                                .collect(Collectors.toList());

                problemDetail.setProperty("errors", fieldErrors);
                return problemDetail;
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex) {
                ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
                problemDetail.setTitle("Resource Not Found");
                return problemDetail;
        }

        @ExceptionHandler(BadRequestException.class)
        public ProblemDetail handleBadRequest(BadRequestException ex) {
                ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
                problemDetail.setTitle("Bad Request");
                return problemDetail;
        }

        @ExceptionHandler(AlreadyExistsException.class)
        public ProblemDetail handleAlreadyExists(AlreadyExistsException ex) {
                ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
                problemDetail.setTitle("Resource Already Exists");
                return problemDetail;
        }

        @ExceptionHandler(Exception.class)
        public ProblemDetail handleGlobalException(Exception ex) {
                // Log the exception here (e.g., log.error("Unexpected error", ex))
                ex.printStackTrace(); // For now print stack trace, better to use Slf4j in future

                ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                                "An unexpected error occurred. Please try again later.");
                problemDetail.setTitle("Internal Server Error");
                return problemDetail;
        }
}

