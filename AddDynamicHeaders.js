// The following code adds a dynamic header for your events through user transformation, for the Webhooks destination.

export function transformEvent(event, metadata) {
  event.header = {
    dynamic_header_1: "dynamic_header_value"
  };

  return event;
}
