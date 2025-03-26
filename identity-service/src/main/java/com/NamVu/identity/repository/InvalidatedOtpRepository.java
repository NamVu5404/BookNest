package com.NamVu.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.NamVu.identity.entity.InvalidatedOtp;

public interface InvalidatedOtpRepository extends JpaRepository<InvalidatedOtp, String> {}
