package com.NamVu.identity.service;

import com.NamVu.identity.entity.User;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;

public interface TokenService {
    String generateToken(User user);

    SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException;
}
