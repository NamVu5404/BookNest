package com.NamVu.post.service;

import com.NamVu.common.exception.AppException;
import com.NamVu.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class DateTimeFormatter {

    Map<Long, Function<Instant, String>> strategyMap = new LinkedHashMap<>();

    public DateTimeFormatter() {
        strategyMap.put(60L, this::formatInSeconds);
        strategyMap.put(60 * 60L, this::formatInMinutes);
        strategyMap.put(60 * 60 * 24L, this::formatInHours);
        strategyMap.put(60 * 60 * 24 * 7L, this::formatInDays);
        strategyMap.put(Long.MAX_VALUE, this::formatInDate);
    }

    public String format(Instant createdDate) {
        long elapseSeconds = ChronoUnit.SECONDS.between(createdDate, Instant.now());

        var strategy = strategyMap.entrySet()
                .stream()
                .filter(longFunctionEntry -> elapseSeconds < longFunctionEntry.getKey())
                .findFirst().orElseThrow(() -> new AppException(ErrorCode.STRATEGY_NOT_FOUND));

        return strategy.getValue().apply(createdDate);
    }

    private String formatInSeconds(Instant createdDate) {
        long elapseSeconds = ChronoUnit.SECONDS.between(createdDate, Instant.now());
        return String.format("%s giây trước", elapseSeconds);
    }

    private String formatInMinutes(Instant createdDate) {
        long elapseMinutes = ChronoUnit.MINUTES.between(createdDate, Instant.now());
        return String.format("%s phút trước", elapseMinutes);
    }

    private String formatInHours(Instant createdDate) {
        long elapseHours = ChronoUnit.HOURS.between(createdDate, Instant.now());
        return String.format("%s giờ trước", elapseHours);
    }

    private String formatInDays(Instant createdDate) {
        long elapseDays = ChronoUnit.DAYS.between(createdDate, Instant.now());

        LocalDateTime localDateTime = createdDate.atZone(ZoneId.systemDefault()).toLocalDateTime();
        java.time.format.DateTimeFormatter dateTimeFormatter
                = java.time.format.DateTimeFormatter.ofPattern("HH:mm");

        return String.format("%s ngày trước lúc %s", elapseDays, localDateTime.format(dateTimeFormatter));
    }

    private String formatInDate(Instant createdDate) {
        LocalDateTime localDateTime = createdDate.atZone(ZoneId.systemDefault()).toLocalDateTime();
        java.time.format.DateTimeFormatter dateTimeFormatter
                = java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy 'lúc' HH:mm");

        return localDateTime.format(dateTimeFormatter);
    }
}
