 // The following code adds a dynamic path to the base URL, while configuring your Webhook destination.
 
export function transformEvent(event, metadata) {
  event.appendPath = `/path/${var}/search?param=${var2}`

  return event;
}
