import {
    checkForExistingBooking,
    getBookingConfig,
    makeBooking,
    fetchDataAndParseSlots,
} from "./utils/bookingLogic.js";

import { checkTokenExpiration, getMsUntilStartTime } from "./utils/helpers.js";

const startTime = process.env.START_TIME;

async function startBookingProcess() {
    console.log("Time hit — starting booking process...");
    let token = await checkTokenExpiration(process.env.AUTH_TOKEN);
    if (token) {
        let existingBooking = await checkForExistingBooking();
        if (!existingBooking) {
            let slots = await fetchDataAndParseSlots();
            if (slots) {
                let bookToken = await getBookingConfig(slots);
                let booking = await makeBooking(bookToken);
                if (booking.resy_token) {
                    console.log(`You've got a reservation!`);
                } else {
                    console.log(`Something went wrong.`);
                }
            }
        } else {
            console.log("You already have a booking.");
        }
    } else {
        console.log("Token expired or invalid.");
    }
}

// Get delay and schedule the function
const delay = getMsUntilStartTime(startTime);
console.log(
    `Waiting ${Math.round(delay / 1000)} seconds until ${startTime}...`
);

setTimeout(() => {
    startBookingProcess();
}, delay);
