export function transformEvent(event) {
    let updatedEvent = event;
    if (
        event.type === 'track' && 
        event.event === 'ide-authentication' && 
        event.properties &&
        event.properties.email && 
        event.properties.email != ''
    ) {
        updatedEvent.type = 'identify';
        let updatedContext = event.context || {}; 
        updatedContext.traits = updatedContext.traits || {};
        updatedContext.traits['email'] = event.properties.email;
        updatedEvent.context = updatedContext;
    }
   return updatedEvent;
}
