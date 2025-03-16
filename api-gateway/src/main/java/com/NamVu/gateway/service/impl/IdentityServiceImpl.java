package com.NamVu.gateway.service.impl;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.gateway.dto.request.IntrospectRequest;
import com.NamVu.gateway.dto.response.IntrospectResponse;
import com.NamVu.gateway.httpclient.IdentityClient;
import com.NamVu.gateway.service.IdentityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IdentityServiceImpl implements IdentityService {
    IdentityClient identityClient;

    @Override
    public Mono<ApiResponse<IntrospectResponse>> introspect(IntrospectRequest request) {
        return identityClient.introspect(request);
    }
}
