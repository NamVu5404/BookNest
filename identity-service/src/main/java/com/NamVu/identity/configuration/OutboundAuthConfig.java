package com.NamVu.identity.configuration;

import com.NamVu.identity.service.OutboundAuthService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class OutboundAuthConfig {
    @Bean
    public Map<String, OutboundAuthService> authenticationServiceMap(
            @Qualifier("google") OutboundAuthService googleAuthServiceImpl,
            @Qualifier("facebook") OutboundAuthService facebookAuthServiceImpl) {

        Map<String, OutboundAuthService> authenticationServiceMap = new HashMap<>();
        authenticationServiceMap.put("google", googleAuthServiceImpl);
        authenticationServiceMap.put("facebook", facebookAuthServiceImpl);

        return authenticationServiceMap;
    }
}
