import jwt from "jsonwebtoken";

function convertToTime(time) {
    const timeString = time.split(" ")[1];
    const [hour, minutes] = timeString.split(":");
    return `${hour}:${minutes}`;
}

function convertTimeToTwelveHourFormat(time) {
    const timeString = time.split(" ")[1];
    const [hour, minutes] = timeString.split(":");
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
}

function convertDateToLongFormat(date) {
    const dateArray = date.split("-");
    const [year, month, day] = dateArray;
    const dateObject = new Date(year, month - 1, day);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return dateObject.toLocaleDateString("en-US", options);
}

function isTimeBetween(startTime, endTime, dateString) {
    let targetTime = dateString.split(" ")[1];

    // Convert times to minutes since midnight
    const convertToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);
    const targetMinutes = convertToMinutes(targetTime);

    return targetMinutes >= startMinutes && targetMinutes <= endMinutes;
}

async function checkTokenExpiration(token) {
    if (!token) {
        console.error(
            "JWT token not found in the AUTH_TOKEN environment variable"
        );
        process.exit(1);
    }

    try {
        const decoded = jwt.decode(token);

        if (decoded) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const timeUntilExpiration = decoded.exp - currentTimestamp;
            const expirationDate = new Date(decoded.exp * 1000);

            if (timeUntilExpiration <= 0) {
                console.log("JWT has already expired");
                return false;
            } else {
                console.log(`JWT will expire on ${expirationDate}`);
                return true;
            }
        } else {
            console.error("JWT decoding failed");
            return false;
        }
    } catch (error) {
        console.error("JWT decoding failed:", error);
        return false;
    }
}

function getMsUntilStartTime(startTime) {
    const [startHour, startMinute] = startTime.split(":").map(Number);

    const now = new Date();

    // Current time in EST
    const estNow = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    const target = new Date(estNow);
    target.setHours(startHour, startMinute, 0, 0);

    // If target time already passed today, schedule for tomorrow
    if (target < estNow) {
        target.setDate(target.getDate() + 1);
    }

    return target - estNow; // milliseconds until target time
}

export {
    convertToTime,
    convertTimeToTwelveHourFormat,
    convertDateToLongFormat,
    isTimeBetween,
    checkTokenExpiration,
    getMsUntilStartTime,
};
