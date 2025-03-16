package com.NamVu.identity.dto.response.identity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserFbResponse extends OutboundUserResponse {
    PictureData picture;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PictureData {
        private PictureInfo data;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PictureInfo {
        private String url;
    }
}
