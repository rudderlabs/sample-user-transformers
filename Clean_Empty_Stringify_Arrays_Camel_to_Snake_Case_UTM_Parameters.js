// 1. Delete empty properties
// 2. Stringify Array values
// 3. Convert camelCase properties to snake_case
// 4. Set UTM campaign values

function transform(events) {
  const cleanedEvents = events.map(cleanEvent);
  return cleanedEvents.map(setUTM);
}

function cleanEvent(e) {
  let newEvent = e;
  if (newEvent.properties) {
    let keys = Object.keys(newEvent.properties);
    if (keys) {
      keys.forEach((key) => {
        if (isEmpty(newEvent.properties[key])) {
          // 1. Delete empty properties
          delete newEvent.properties[key];
        } else if (Array.isArray(newEvent.properties[key])) {
          // 2. Stringify Array values
          newEvent.properties[key] = JSON.stringify(newEvent.properties[key]);
        }
        const snake_key = to_snake_case(key);
        if (key.toLowerCase() !== snake_key) {
          // 3. Convert camelCase properties to snake_case
          newEvent.properties[snake_key] = newEvent.properties[key];
          delete newEvent.properties[key];
        }
      });
    }
  }
  return newEvent;
}

function setUTM(e) {
  // 4. Set UTM Campaign Values
  const searchParams = e.context.page ? e.context.page.search : undefined;
  if (searchParams) {
    // [?test1=val1,test2=val2] = (?test1=val1&test2=val2).trim().split('&');
    const indvSearchParams = searchParams.trim().split("&");
    if (indvSearchParams.length > 0) {
      // remove the preceding '?'
      const firstSearchString = indvSearchParams[0].slice(
        1,
        indvSearchParams[0].length
      );
      indvSearchParams[0] = firstSearchString;

      indvSearchParams.forEach((valSearch) => {
        var keyValPairs = valSearch.split("="); // seperate key and val
        if (keyValPairs[0].length > 0) {
          if (!e.context.campaign) {
            e.context.campaign = {};
          }
          // will be e.context.campaign[keyValPairs[0]] = keyValPairs[1], for now keeping key "UTM" and overiding
          if (keyValPairs[0] === "type") {
            e.context.campaign.utm = keyValPairs[1];
          }
          if (keyValPairs[0] === "utm_campaign") {
            e.context.campaign.name = keyValPairs[1];
          } else if (keyValPairs[0] === "utm_source") {
            e.context.campaign.source = keyValPairs[1];
          } else if (keyValPairs[0] === "utm_medium") {
            e.context.campaign.medium = keyValPairs[1];
          } else if (keyValPairs[0] === "utm_term") {
            e.context.campaign.term = keyValPairs[1];
          } else if (keyValPairs[0] === "utm_content") {
            e.context.campaign.content = keyValPairs[1];
          }
        }
      });
    }
  }
  return e;
}

// Helpers
function isEmpty(prop) {
  if (
    !prop ||
    prop === null ||
    typeof prop === "undefined" ||
    prop.length === 0 ||
    isEmptyObj(prop)
  ) {
    return true;
  }
  return false;
}

function isEmptyObj(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

function to_snake_case(str) {
  return (
    str[0].toLowerCase() +
    str
      .slice(1, str.length)
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  );
}
