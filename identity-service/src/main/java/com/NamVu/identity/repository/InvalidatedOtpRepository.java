package com.NamVu.identity.repository;

import com.NamVu.identity.entity.InvalidatedOtp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedOtpRepository extends JpaRepository<InvalidatedOtp, String> {
}
