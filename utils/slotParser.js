import { convertToTime, convertTimeToTwelveHourFormat } from "./helpers.js";

async function slotParser(slots) {
    const numberOfSlots = slots.length;
    console.log(`There are ${numberOfSlots} slots available`);
    let priorityTimes = JSON.parse(process.env.TIMES || []);

    for (const priorityTime of priorityTimes) {
        for (const slot of slots) {
            const time = slot.date.start;
            const reservationType = slot.config.type;

            const token = await slotChooser(
                slot,
                time,
                reservationType,
                priorityTime
            );
            if (token) {
                return token;
            }
        }
    }

    return null;
}

async function slotChooser(slot, time, type, targetTime) {
    if (convertToTime(time) === targetTime) {
        console.log(
            `Booking a prime slot at ${convertTimeToTwelveHourFormat(time)} ${
                type === "Dining Room" ? "in" : "on"
            } the ${type}!`
        );
        return slot.config.token;
    }
}

export { slotParser };
