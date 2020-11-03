export function transformEvent(event) {
    //Remove keys which do not have values
    let cleanEvent = event;
    if (cleanEvent.properties) {
        let keys = Object.keys(cleanEvent.properties)
        if (keys) {
            keys.forEach(key => {
                if (cleanEvent.properties[key] === null) {
                    delete cleanEvent.properties[key]
                }
            })
        }
    }
    return cleanEvent;
}