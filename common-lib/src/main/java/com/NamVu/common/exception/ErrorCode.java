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
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Lỗi không xác định", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "Người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1003, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_BLANK(1004, "Mật khẩu không được để trống", HttpStatus.BAD_REQUEST),
    NAME_NOT_BLANK(1005, "Tên không được để trống", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_BLANK(1006, "Email không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1007, "Mật khẩu phải có ít nhất {min} kí tự và" +
            " không quá {max} kí tự.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1008, "Email không đúng định dạng", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(1009, "Số điện thoại không đúng định dạng", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1010, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1011, "Bạn không được ủy quyền", HttpStatus.FORBIDDEN),
    PASSWORD_EXISTED(1012, "Mật khẩu đã tồn tại", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(1013, "Mật khẩu cũ không chính xác", HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_NOT_BLANK(1014, "Mật khẩu cũ không được để trống", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_NOT_BLANK(1015, "Mật khẩu mới không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1016, "Tuổi phải lớn hơn hoặc bằng {min} và nhỏ hơn hoặc bằng {max} tuổi", HttpStatus.BAD_REQUEST),
    PROFILE_NOT_EXISTED(1017, "Profile không tồn tại", HttpStatus.NOT_FOUND),
    CAN_NOT_SEND_EMAIL(1018, "Không thể gửi email", HttpStatus.BAD_REQUEST),
    POST_NOT_EXISTED(1019, "Bài viết không tồn tại", HttpStatus.NOT_FOUND),
    STRATEGY_NOT_FOUND(1020, "Strategy not found", HttpStatus.NOT_FOUND),
    PHONE_NOT_BLANK(1021, "Số điện thoại không được để trống", HttpStatus.BAD_REQUEST),
    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
