/***  
* A custom user transoformation to save all event properties into one json column only
* 
* **Background**
* RudderStack discards events with more than 200 properties as "Bad Event".
* This results in droping genuine events sometimes. A usual challenge faced in collecting data 
* from unstructured webhook data with lots of nested values.
* Also these properties are flattened by default in warehouse, 
* resulting in too many columns sometimes reaching the upper limit of columns in warehouses.
* 
* **Solution**
* Store all event properties as single json data type column.
* Here, we first move `event.properties` to `context.properties` 
* and then set `jsonPaths` option to `track.context.proprerties`.
* This instructs RudderStack to not flatten `context.proprerties` of `track` events
* and store that as json data type column.
* More info about JSON Column Support - https://www.rudderstack.com/docs/destinations/warehouse-destinations/json-column-support
***/

export function transformEvent(event, metadata) {
    if(!event || !event.properties || event.event !== "webhook_source_event") return event;
    // Special transformations for webhook source events
    let meta = metadata(event);
    let modifiedEvent = moveEventPropertiesToContextProperties(event);
    return addJsonPaths(modifiedEvent, ["track.context.properties"], meta.destinationType);
}

/**
 * Move event.properties to context.properties
 */
function moveEventPropertiesToContextProperties(event){
    let modifiedEvent = JSON.parse(JSON.stringify(event));
    modifiedEvent.context = Object.assign(modifiedEvent.context || {}, { properties: modifiedEvent.properties });
    delete modifiedEvent.properties;
    return modifiedEvent;
}

/**
 * Add json path in order to save certain columns as json data type
 */
function addJsonPaths(event, paths, integrationName){
    let modifiedEvent = JSON.parse(JSON.stringify(event));
    if(!integrationName) integrationName = "ALL";
    if(!modifiedEvent.integrations) modifiedEvent.integrations = {};
    if(!modifiedEvent.integrations[integrationName]) modifiedEvent.integrations[integrationName] = {};
    if(!modifiedEvent.integrations[integrationName].options) modifiedEvent.integrations[integrationName].options = {};
    Object.assign(modifiedEvent.integrations[integrationName].options, { jsonPaths: [...paths]});
    return modifiedEvent;
}
