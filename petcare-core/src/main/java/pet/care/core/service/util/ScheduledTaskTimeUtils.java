package pet.care.core.service.util;

import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRule;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;
import org.joda.time.DateTimeZone;
import org.jooq.lambda.Seq;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.dmfs.rfc5545.recur.RecurrenceRule.RfcMode.RFC2445_LAX;

public class ScheduledTaskTimeUtils {


    public static Map<String, String> getRRuleMap(String rRule) {

        Map<String, String> output = new HashMap<>();

        output.putAll(Seq.seq(Arrays.asList(rRule.split(";")))
                .map(kv -> kv.split("="))
                .filter(ar -> ar.length == 2)
                .toMap(ar -> ar[0], ar -> ar[1])
        );

        return output;
    }

    public static Optional<Long> findNext(String expression, long dateTime) {

        try {

            RecurrenceRuleIterator ruleIterator = getRRuleIterator(expression);

            while (ruleIterator.hasNext()) {
                long nextMillis = ruleIterator.nextMillis();

                if (nextMillis > dateTime) {
                    return Optional.of(nextMillis);
                }
            }
            return Optional.empty();
        } catch (InvalidRecurrenceRuleException e) {
            return Optional.empty();
        }
    }

    public static Optional<Long> findPrevious(String expression, long dateTime) {

        try {

            RecurrenceRuleIterator ruleIterator = getRRuleIterator(expression);

            Long recent = null;

            while (ruleIterator.hasNext()) {
                long nextMillis = ruleIterator.nextMillis();

                if (nextMillis < dateTime) {
                    recent = nextMillis;
                } else {
                    return Optional.ofNullable(recent);
                }
            }
            return Optional.empty();
        } catch (InvalidRecurrenceRuleException e) {
            return Optional.empty();
        }
    }

    public static RecurrenceRuleIterator getRRuleIterator(String expression) throws InvalidRecurrenceRuleException {
        Map<String, String> rRuleMap = getRRuleMap(expression);

        String dStart = rRuleMap.get("DTSTART");

        if (dStart == null || dStart.trim().isEmpty()) {
            throw new InvalidRecurrenceRuleException("RRule DTSTART can not be null");
        }

        String tzId = rRuleMap.getOrDefault(
                "TZID",
                DateTimeFormats.TIME_ZONE_UTC.getID()
        );

        RecurrenceRule rule = new RecurrenceRule(expression, RFC2445_LAX);

        return rule.iterator(
                DateTimeFormats.convertUtcStringToLong(dStart),
                DateTimeZone.forID(tzId).toTimeZone()
        );
    }
}
