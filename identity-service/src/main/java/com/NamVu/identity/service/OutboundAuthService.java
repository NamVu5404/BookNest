package com.NamVu.identity.service;

import com.NamVu.identity.dto.response.auth.AuthenticationResponse;

public interface OutboundAuthService {
    AuthenticationResponse outboundAuthentication(String code);
}
