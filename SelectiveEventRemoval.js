function transform(events) {
  const filterEventNames = [
    // Add list of event names that you want to filter out
    "game_load_time",
    "lobby_fps"
  ];

  // remove events whose name match those in above list
  const filteredEvents = events.filter(event => {
    const eventName = event.event;
    return !(eventName && filterEventNames.includes(eventName));
  });

  // remove events of a certain type if related property value does not satisfy pre-defined condition
  // in this example, if 'total_payment' for a 'spin' event is null or 0, then it would be removed.
  // Only non-null, non-zero 'spin' events would be considered
  const nonSpinAndSpinPayerEvents = events.filter(event => {
    const eventName = event.event;
    // spin events
    if (eventName.toLowerCase().indexOf("spin") >= 0) {
      if (
        event.userProperties &&
        event.userProperties.total_payments &&
        event.userProperties.total_payments > 0
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return nonSpinAndSpinPayerEvents;
}
