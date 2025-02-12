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
