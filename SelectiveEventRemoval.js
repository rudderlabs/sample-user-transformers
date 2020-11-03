export function transformEvent(event) {
    const filterEventNames = [
        // Add list of event names that you want to filter out
        "game_load_time",
        "lobby_fps"
    ];

    //drop event whose name match those in above list
    const eventName = event.event;
    if (eventName && filterEventNames.includes(eventName)){
        return; // drop event
    }
    return event;
}