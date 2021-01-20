// In the below example, we'll be transforming a standard track event to a correct identify event
// to be working with Salesforce Object implementation
function transform(events) {
  // map of events to object types
  // create - if there is no valid value for the field "Id" (case sensitive)
  // update - if a valid value is passed to the "Id" field
  const eventActionMap = {
    "Contact Created": {
      object: "Contact",
      properties: {
        firstName: "FirstName",
        lastName: "LastName",
        email: "Email",
        phone: "Phone",
        homePhone: "HomePhone"
      }
    },
    "Contact Updated": {
      object: "Contact",
      properties: { // will call update operation if contactId is valid
        contactId: "Id",
        firstName: "FirstName",
        lastName: "LastName",
        email: "Email",
        phone: "Phone",
        homePhone: "HomePhone"
      }
    }
  };
  const transformedEvents = [];

  events.forEach(ev => {
    if (ev.type !== "track") {
      // add all events except track
      transformedEvents.push(ev);
    }

    const eventTransformationMap = eventActionMap[ev.event];
    if (!eventTransformationMap) {
      // add all non-mapped events
      transformedEvents.push(ev);
    }

    const { object, properties } = eventTransformationMap;
    if (!object || !properties) {
      // Salesforce object or mapping is not correct
      transformedEvents.push(ev);
    }

    if (!ev.properties) {
      // add the event if there is no property in the event
      transformedEvents.push(ev);
    }

    const eventProperties = ev.properties;
    const traits = {};
    let objectId;
    // iterate over defined properties and extract the values from event.properties and
    // set them to traits and context.traits
    Object.keys(properties).forEach(key => {
      if (properties[key] === "Id") {
        // take the Id separately and
        objectId = eventProperties[key];
      } else {
        traits[properties[key]] = eventProperties[key];
      }
    });

    // finally contruct the event back
    const finalEvent = ev;
    finalEvent.type = "identify";
    finalEvent.traits = traits;
    finalEvent.context.traits = traits;
    finalEvent.context.externalId = [
      {
        type: `Salesforce-${object}`,
        id: objectId
      }
    ];
    finalEvent.integrations = { Salesforce: true };

    transformedEvents.push(finalEvent);
  });

  // return the final array
  return transformedEvents;
}
