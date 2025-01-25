package pet.care.core.service.util;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

import java.time.Clock;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

public class TimeUtils {
    private static final DateTimeZone TIME_ZONE_LOCAL = DateTimeZone.forTimeZone(TimeZone.getTimeZone("IST"));

    public static long currentUtcTime() {
        return Clock.systemUTC().millis();
    }

    public static long startTimeOfUtcToday() {
        return DateTime.now(DateTimeZone.UTC).withTimeAtStartOfDay().getMillis();
    }

    public static long startTimeOfLocalToday() {
        return DateTime.now(TIME_ZONE_LOCAL).withTimeAtStartOfDay().getMillis();
    }

    public static long startTimeOfUtcTodayPlusDays(int days) {
        return DateTime.now(DateTimeZone.UTC).withTimeAtStartOfDay().plusDays(days).getMillis();
    }

    public static long startTimeOfUtcGivenTime(long givenTime) {
        return new DateTime(givenTime).withTimeAtStartOfDay().getMillis();
    }

    public static long startTimeOfLocalGivenTime(long givenTime) {
        return new DateTime(givenTime).withZone(TIME_ZONE_LOCAL).withTimeAtStartOfDay().getMillis();
    }

    public static long daysInMills(int days) {
        return TimeUnit.DAYS.toMillis(days);
    }

}
