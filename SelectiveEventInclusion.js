export function transformEvent(event) {
    const whitelistedEventNames = [
        // Add event names that you want to whitelist
        "game_load_time",
        "lobby_fps"
    ];

    // Return event if its name is included in the above list
    const eventName = event.event;
    if (eventName && whitelistedEventNames.includes(eventName)){
        return event;
    }
    return; // Drop event if its name is not included
}