package com.NamVu.gateway.service;

import com.NamVu.common.dto.ApiResponse;
import com.NamVu.gateway.dto.request.IntrospectRequest;
import com.NamVu.gateway.dto.response.IntrospectResponse;
import reactor.core.publisher.Mono;

public interface IdentityService {
    Mono<ApiResponse<IntrospectResponse>> introspect(IntrospectRequest request);
}
