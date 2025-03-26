package com.NamVu.identity.service;

import java.text.ParseException;

import com.NamVu.identity.entity.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

public interface TokenService {
    String generateToken(User user);

    SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException;
}
