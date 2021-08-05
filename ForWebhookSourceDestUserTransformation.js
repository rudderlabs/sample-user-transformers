// custom webhook source of mailchimp and destination if GA

function transformEvent(event) {

    const updatedEvent = event[0];
    
    const { properties } = event[0];
    
    if (properties) {
    
    updatedEvent.event = properties.type;
    
    updatedEvent.userId = properties["data[email]"];
    
    updatedEvent.properties.name = `${properties["data[merges][FNAME]"]} ${properties["data[merges][LNAME]"]}`;
    
    updatedEvent.properties.phone = properties["data[merges][PHONE]"];
    
    delete updatedEvent.properties["data[merges][PHONE]"];
    
    delete updatedEvent.properties["data[merges][FNAME]"];
    
    delete updatedEvent.properties["data[merges][LNAME]"];
    
    }
    
    return updatedEvent;
    
    }