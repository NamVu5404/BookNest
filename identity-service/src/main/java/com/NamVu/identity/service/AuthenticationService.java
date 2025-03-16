package com.NamVu.identity.service;

import com.NamVu.identity.dto.request.auth.AuthenticationRequest;
import com.NamVu.identity.dto.request.auth.IntrospectRequest;
import com.NamVu.identity.dto.request.auth.LogoutRequest;
import com.NamVu.identity.dto.request.auth.RefreshRequest;
import com.NamVu.identity.dto.response.auth.AuthenticationResponse;
import com.NamVu.identity.dto.response.auth.IntrospectResponse;
import com.NamVu.identity.dto.response.auth.RefreshResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);

    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;

    void logout(LogoutRequest request) throws ParseException, JOSEException;

    RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;
}

