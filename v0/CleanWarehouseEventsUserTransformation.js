function transform(events) {

  //Remove keys which do not have values
  let cleanEvents = events.map(ev => {
    if (ev.properties) {
      let keys = Object.keys(ev.properties)
      if (keys) {
        keys.forEach(key => {
          if (ev.properties[key] === null) {
              delete ev.properties[key]
          }
        })
      }  
    }
    return ev
  });
  

  return cleanEvents;
}