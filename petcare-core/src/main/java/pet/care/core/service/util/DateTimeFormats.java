package pet.care.core.service.util;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.util.TimeZone;

public class DateTimeFormats {
    public static final DateTimeZone TIME_ZONE_UTC = DateTimeZone.forTimeZone(TimeZone.getTimeZone("UTC"));

    public static final DateTimeFormatter DATE_TIME_FORMATTER_Z = DateTimeFormat.forPattern("yyyyMMdd'T'HHmmss'Z").withZone(DateTimeZone.UTC);

    public static long convertUtcStringToLong(String utcString) {
        return DATE_TIME_FORMATTER_Z.parseMillis(utcString);
    }

    public static String convertUtcLongToUtcString(long timestamp) {
        return DATE_TIME_FORMATTER_Z.print(new DateTime(timestamp, DateTimeZone.UTC));
    }
}
