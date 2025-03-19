import {RRule, rrulestr} from "rrule";

export const parseRRuleManually = (rruleString) => {
    try {
        const ruleParts = rruleString.split(";");
        let days = "",
            startDate = "",
            endDate = "",
            startTime = "";

        ruleParts.forEach((part) => {
            const [key, value] = part.split("=");

            switch (key) {
                case "BYDAY":
                    const dayMap = {
                        MO: "Mon",
                        TU: "Tue",
                        WE: "Wed",
                        TH: "Thu",
                        FR: "Fri",
                        SA: "Sat",
                        SU: "Sun",
                    };
                    days = value.split(",").map((day) => dayMap[day] || day).join(", ");
                    break;
                case "DTSTART":
                    startDate = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
                    startTime = `${value.substring(9, 11)}:${value.substring(11, 13)}`;
                    break;
                case "UNTIL":
                    endDate = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
                    break;

                default:
                    break;
            }
        });

        return {
            days: days || "N/A",
            startDate: startDate ? new Date(startDate).toLocaleDateString("en-GB") : "N/A",
            endDate: endDate ? new Date(endDate).toLocaleDateString("en-GB") : "Ongoing",
            startTime: startTime
                ? new Date(`1970-01-01T${startTime}:00Z`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
                : "N/A",
        };
    } catch (error) {
        return {days: "Invalid RRule", startDate: "-", endDate: "-", startTime: "-"};
    }
};

export const parseRecurrenceRule = (recurrenceRule, status) => {
    const title = status === "draft" ? "Drafted" : status === "cancelled" ? "Cancelled" : "Session"
    const color = status === "draft" ? "#bab7b7" : status === "cancelled" ? "#d32f2f" : "#1976d2"

    const rule = rrulestr(recurrenceRule);
    const options = rule.options;

    // Mapping numeric days to short day names for FullCalendar
    const weekdayMap = [
        "su",
        "mo",
        "tu",
        "we",
        "th",
        "fr",
        "sa"
    ];

    // Convert numeric weekdays to their corresponding names
    const byweekday = options.byweekday
        ? options.byweekday.map(day => weekdayMap[Number(day)])
        : undefined;

    const frequencyMap = {
        [RRule.YEARLY]: "yearly",
        [RRule.MONTHLY]: "monthly",
        [RRule.WEEKLY]: "weekly",
        [RRule.DAILY]: "daily",
    };

    return {
        title: title,
        rrule: {
            freq: frequencyMap[options.freq], // Convert frequency number to string
            interval: options.interval || 1, // Default to 1 if not specified
            byweekday: byweekday,
            dtstart: options.dtstart.toISOString(), // Convert to ISO string
            until: options.until ? options.until.toISOString() : undefined,
        },
        backgroundColor: color
    };
};

export const convertSessionsToEvents = (sessions) => {
    return sessions.map(session => ({
        title: session.status,
        start: new Date(session.start).toISOString(),
        backgroundColor: getStatusColor(session.status),
        borderColor: getStatusColor(session.status),
    }));
};

// Helper function to define colors based on session status
const getStatusColor = (status) => {
    const colors = {
        "Scheduled": "#1976d2", // Blue
        "Started": "#4caf50", // Orange
        "Completed": "#120719", // Green
        "Cancelled": "#d32f2f", // Red
    };
    return colors[status] || "#9e9e9e";
};