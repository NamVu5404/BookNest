package com.NamVu.identity.service;

import com.NamVu.identity.dto.response.identity.OutboundUserResponse;
import com.NamVu.identity.entity.User;

public interface OutboundUserService {
    User onboardUser(OutboundUserResponse userInfo);
}
