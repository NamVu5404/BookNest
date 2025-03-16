package com.NamVu.common.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1003, "User not existed", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_BLANK(1004, "Password is required", HttpStatus.BAD_REQUEST),
    NAME_NOT_BLANK(1005, "Name is required", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_BLANK(1006, "Email is required", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1007, "Password must be at least {min} characters and" +
            " no more than {max} characters.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1008, "Invalid email format", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(1009, "Invalid phone format", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1010, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1011, "You do not have permission", HttpStatus.FORBIDDEN),
    PASSWORD_EXISTED(1021, "Password existed", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(1022, "Old password incorrect", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_NOT_BLANK(1023, "Old password is required", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_NOT_BLANK(1024, "New password is required", HttpStatus.BAD_REQUEST),
    PHONE_NOT_BLANK(1007, "Phone is required", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1011, "Your age must be at least {min} and under {max}", HttpStatus.BAD_REQUEST),
    PROFILE_NOT_EXISTED(1003, "Profile not existed", HttpStatus.NOT_FOUND),
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
