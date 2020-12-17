function transform(events) {
  const updatedEvents = [];
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (
      event.type === "track" &&
      event.event === "ide-authentication" &&
      event.properties &&
      event.properties.email &&
      event.properties.email !== ""
    ) {
      const updatedEvent = event;
      updatedEvent.type = "identify";
      const updatedContext = event.context || {};
      updatedContext.traits = updatedContext.traits || {};
      updatedContext.traits.email = event.properties.email;
      updatedEvent.context = updatedContext;
      updatedEvents.push(updatedEvent);
    } else {
      updatedEvents.push(event);
    }
  }

  return updatedEvents;
}
