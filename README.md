# Sample RudderStack Transformations

[RudderStack Transformations](https://rudderstack.com/product/transformations/) give you the ability to code custom JavaScript functions to implement specific use-cases on your event data. This repository contains some useful transformation templates that you can use to create your own transformations. For more information on RudderStack Transformations, check out the [documentation](https://rudderstack.com/docs/transformations/).

## Table of Contents

- [Getting Started](#getting-started)
- [Filtering](#filtering)
  - [Blacklist Event Names](#blacklist-event-names)
  - [Whitelist Email Domains](#whitelist-email-domains)
- [Sampling](#sampling)
  - [User Based](#user-based)
- [Enrichment](#enrichment)
  - [Geolocation Data](#geolocation-data)
  - [User Data](#user-data)
  - [User Agent Data](#user-agent-data)
  - [Dynamic Header](#dynamic-header)
  - [Dynamic Path](#dynamic-path)
- [Masking](#masking)
  - [Replace PII](#replace-pii)
- [Cleaning](#cleaning)
  - [Remove Null Properties](#remove-null-properties)
- [Miscellaneous](#miscellaneous)
  - [Source ID](#source-id)
  - [Change Event Type](#change-event-type)
  - [Batch](#batch)

## Getting Started

The sample [transformations](https://www.rudderstack.com/docs/transformations/) and [libraries](https://www.rudderstack.com/docs/transformations/#libraries) included in this repository can be added via the [RudderStack dashboard](https://app.rudderstack.com/):

1. Click the [Transformations](https://app.rudderstack.com/transformations) button.
2. Click a CREATE NEW button.
3. Add a name and code to the transformation or library.
4. Click the Save button.

For detailed steps on adding a new transformation or library, check out the [documentation](https://rudderstack.com/docs/transformations/).

## Filtering

### Blacklist Event Names

> Filter out event if a property (event name in this example) is included in a blacklist

1. Drop event if blacklist includes event name
2. Return event otherwise

```javascript
export function transformEvent(event, metadata) {
    const eventNames = ["game_load_time", "lobby_fps"];
    const eventName = event.event;
    if (eventName && eventNames.includes(eventName)) return;
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td>{<br>&emsp;"event": "game_load_time"<br>}</td>
      <td></td>
    </tr>
    <tr>
      <td>{<br>&emsp;"event": "players"<br>}</td>
      <td>{<br>&emsp;"event": "players"<br>}</td>
    </tr>
  </table>
</details>

### Whitelist Email Domains

> Filter out event if a property (email domain in this example) is not included in a whitelist

1. Return event if whitelist includes email domain
2. Drop event otherwise

```javascript
export function transformEvent(event, metadata) {
    const domains = ["rudderstack.com", "rudderlabs.com"];
    const email = event.context?.traits?.email;
    if (email && domains.includes(email.split("@").pop())) return event;
    return;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "john@gmail.com"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
      <td></td>
    </tr>
    <tr>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "john@rudderstack.com"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "john@rudderstack.com"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
    </tr>
  </table>
</details>

## Sampling

### User Based

> Drop a random sample of events based on a property (user ID in this example)

1. Import `cyrb53` function from [hash](libraries/hash.js) library 
2. Drop event if remainder of hashed user ID less than 5
3. Return event otherwise

```javascript
import { cyrb53 } from "hash";

export function transformEvent(event, metadata) {
    const userId = event.userId;
    if (userId && cyrb53(userId) % 10 < 5) return;
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td>{<br>&emsp;"userId": "54321"<br>}</td>
      <td></td>
    </tr>
    <tr>
      <td>{<br>&emsp;"userId": "12345"<br>}</td>
      <td>{<br>&emsp;"userId": "12345"<br>}</td>
    </tr>
  </table>
</details>

## Enrichment

### Geolocation Data

> Enrich event with geolocation data using an external API and IP address

1. Fetch geolocation data from external IP2Location API
2. Add data to event
3. Return event

```javascript
export async function transformEvent(event, metadata) {
    if (event.request_ip) {
        const res = await fetch("https://api.ip2location.com/v2/?ip=" + event.request_ip.trim() + "&addon=<required addon e.g.geotargeting>&lang=en&key=<IP2Location_API_Key>&package=<package as required e.g. WS10>");
        event.context.geolocation = res;
    }
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td valign="top">{<br>&emsp;"context": {<br>&emsp;&emsp;"ip": "64.233.160.0"<br>&emsp;}<br>}</td>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"ip": "64.233.160.0",<br>&emsp;&emsp;"geolocation": {<br>&emsp;&emsp;&emsp;"country_code": "US",<br>&emsp;&emsp;&emsp;"country_name": "United States",<br>&emsp;&emsp;&emsp;"region_name": "California",<br>&emsp;&emsp;&emsp;"city_name": "Mountain View",<br>&emsp;&emsp;&emsp;"latitude": "37.405992",<br>&emsp;&emsp;&emsp;"longitude": "-122.078515",<br>&emsp;&emsp;&emsp;"zip_code": "94043",<br>&emsp;&emsp;&emsp;"time_zone": "-07:00"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
    </tr>
  </table>
</details>

### User Data

> Enrich event with user data using an external API and email address

1. Get user data from external Clearbit API
2. Add data to event's traits
3. Return event

```javascript
export async function transformEvent(event) {
    const email = event.context?.traits?.email;
    if (email) {
        const res = await fetch("https://person.clearbit.com/v2/combined/find?email=" + email, {
            headers: {
                "Authorization": "Bearer <your_clearbit_secure_key"
            }
        });
        event.context.traits.enrichmentInfo = res;
    }
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td valign="top">{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "alex@alexmaccaw.com"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "john@gmail.com",<br>&emsp;&emsp;&emsp;"enrichmentInfo": {<br>&emsp;&emsp;&emsp;&emsp;"id": "d54c54ad-40be-4305-8a34-0ab44710b90d",<br>&emsp;&emsp;&emsp;&emsp;"name": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"fullName": "Alex MacCaw",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"givenName": "Alex",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"familyName": "MacCaw"<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"email": "alex@alexmaccaw.com",<br>&emsp;&emsp;&emsp;&emsp;"location": "San Francisco, CA, US",<br>&emsp;&emsp;&emsp;&emsp;"timeZone": "America/Los_Angeles",<br>&emsp;&emsp;&emsp;&emsp;"utcOffset": -8,<br>&emsp;&emsp;&emsp;&emsp;"geo": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"city": "San Francisco",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"state": "California",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"stateCode": "CA",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"country": "United States",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"countryCode": "US",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"lat": 37.7749295,<br>&emsp;&emsp;&emsp;&emsp;&emsp;"lng": -122.4194155<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"bio": "O'Reilly author, software engineer & traveller. Founder of https://clearbit.com",<br>&emsp;&emsp;&emsp;&emsp;"site": "http://alexmaccaw.com",<br>&emsp;&emsp;&emsp;&emsp;"avatar": "https://d1ts43dypk8bqh.cloudfront.net/v1/avatars/d54c54ad-40be-4305-8a34-0ab44710b90d",<br>&emsp;&emsp;&emsp;&emsp;"employment": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"domain": "clearbit.com",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"name": "Clearbit",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"title": "Co-founder, CEO",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"role": "leadership",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"subRole": "ceo",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"seniority": "executive"<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"facebook": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"handle": "amaccaw"<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"github": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"handle": "maccman",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"avatar": "https://avatars.githubusercontent.com/u/2142?v=2",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"company": "Clearbit",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"blog": "http://alexmaccaw.com",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"followers": 2932,<br>&emsp;&emsp;&emsp;&emsp;&emsp;"following": 94<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"twitter": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"handle": "maccaw",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"id": "2006261",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"bio": "O'Reilly author, software engineer & traveller. Founder of https://clearbit.com",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"followers": 15248,<br>&emsp;&emsp;&emsp;&emsp;&emsp;"following": 1711,<br>&emsp;&emsp;&emsp;&emsp;&emsp;"location": "San Francisco",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"site": "http://alexmaccaw.com",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"avatar": "https://pbs.twimg.com/profile_images/1826201101/297606_10150904890650705_570400704_21211347_1883468370_n.jpeg"<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"linkedin": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"handle": "pub/alex-maccaw/78/929/ab5"<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"googleplus": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"handle": null<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"gravatar": {<br>&emsp;&emsp;&emsp;&emsp;&emsp;"handle": "maccman",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"urls": [<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"value": "http://alexmaccaw.com",<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"title": "Personal Website"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>&emsp;&emsp;&emsp;&emsp;&emsp;],<br>&emsp;&emsp;&emsp;&emsp;&emsp;"avatar": "http://2.gravatar.com/avatar/994909da96d3afaf4daaf54973914b64",<br>&emsp;&emsp;&emsp;&emsp;&emsp;"avatars": [<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"url": "http://2.gravatar.com/avatar/994909da96d3afaf4daaf54973914b64",<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"type": "thumbnail"<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>&emsp;&emsp;&emsp;&emsp;&emsp;]<br>&emsp;&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;&emsp;"fuzzy": false,<br>&emsp;&emsp;&emsp;&emsp;"emailProvider": false,<br>&emsp;&emsp;&emsp;&emsp;"indexedAt": "2016-11-07T00:00:00.000Z"<br>&emsp;&emsp;&emsp;}<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
    </tr>
  </table>
</details>

### User Agent Data

> Enrich event with parsed user agent data

1. Import `UAParser` function from [user agent parser](libraries/userAgentParser.js) library
2. Add parsed user agent data
3. Return event

```javascript
import { UAParser } from "userAgentParser";

export function transformEvent(event, metadata) {
    const userAgent = event.context?.userAgent;
    if (userAgent) {
        const parser = new UAParser();
        const parsedUserAgent = parser.setUA(userAgent).getResult();
        event.context.parsedUserAgent = parsedUserAgent;
    }
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td valign="top">{<br>&emsp;"context": {<br>&emsp;&emsp;"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:98.0) Gecko/20100101 Firefox/98.0"<br>&emsp;}<br>}</td>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:98.0) Gecko/20100101 Firefox/98.0",<br>&emsp;&emsp;"parsedUserAgent": {<br>&emsp;&emsp;&emsp;"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:98.0) Gecko/20100101 Firefox/98.0",<br>&emsp;&emsp;&emsp;"browser": {<br>&emsp;&emsp;&emsp;&emsp;"name": "Firefox",<br>&emsp;&emsp;&emsp;&emsp;"version": "98.0",<br>&emsp;&emsp;&emsp;&emsp;"major": "98"<br>&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;"engine": {<br>&emsp;&emsp;&emsp;&emsp;"name": "Gecko",<br>&emsp;&emsp;&emsp;&emsp;"version": "98.0"<br>&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;"os": {<br>&emsp;&emsp;&emsp;&emsp;"name": "Mac OS",<br>&emsp;&emsp;&emsp;&emsp;"version": "10.15"<br>&emsp;&emsp;&emsp;},<br>&emsp;&emsp;&emsp;"device": {},<br>&emsp;&emsp;&emsp;"cpu": {}<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
    </tr>
  </table>
</details>

### Dynamic Header

> Add a dynamic header to event payload

1. Add dynamnic header to event
2. Return event

```javascript
export function transformEvent(event, metadata) {
    event.header = {
        dynamic_header_1: "dynamic_header_1_value",
        dynamic_header_2: "dynamic_header_2_value"
    };
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td valign="top">{<br>&emsp;"event": "Button Clicked"<br>}</td>
      <td>{<br>&emsp;"event": "Button Clicked",<br>&emsp;"header": {<br>&emsp;&emsp;"dynamic_header_1": "dynamic_header_1_value",<br>&emsp;&emsp;"dynamic_header_2": "dynamic_header_2_value"<br>&emsp;}<br>}</td>
    </tr>
  </table>
</details>

### Dynamic Path

> Dynamically append the event endpoint

1. Add dynamic path to event's endpoint base URL
2. Return event

```javascript
export function transformEvent(event, metadata) {
    const email = event.context?.traits?.email;
    if (email) event.appendPath = `/search?email=${email}`;
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td valign="top">{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "john@gmail.com"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
      <td valign="top">{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "john@gmail.com"<br>&emsp;&emsp;}<br>&emsp;},<br>&emsp;"appendPath": "/search?email=john@gmail.com"<br>}</td>
    </tr>
  </table>
</details>

## Masking

### Replace PII

> Fuzzy find and replace PII properties (social security number in this example)

1. Import `walk` function from [fuzzy find replace](libraries/fuzzyFindReplace.js) library
2. Replace values where keys approximately match target keys
3. Return event

```javascript
import { walk } from "fuzzyFindReplace";

export function transformEvent(event, metadata) {
    const targetKeys = [
        "SSN",
        "Social Security Number",
        "social security no.",
        "social sec num",
        "ssnum"
    ];
    walk(event, targetKeys, "XXX-XX-XXXX");
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"socialSecurityNumber": "123-45-6789"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
      <td>{<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"socialSecurityNumber": "XXX-XX-XXXX"<br>&emsp;&emsp;}<br>&emsp;}<br>}</td>
    </tr>
  </table>
</details>

## Cleaning

### Remove Null Properties

> Remove all properties with null values

1. Remove properties with null values
2. Return event

```javascript
export function transformEvent(event) {
    if (event.properties) {
        const keys = Object.keys(event.properties);
        if (keys) {
            keys.forEach(key => {
                if (event.properties[key] === null) delete event.properties[key];
            })
        }
    }
    return event;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td>{<br>&emsp;"properties": {<br>&emsp;&emsp;"revenue": null,<br>&emsp;&emsp;"quantity": 4<br>&emsp;}<br>}</td>
      <td valign="top">{<br>&emsp;"properties": {<br>&emsp;&emsp;"quantity": 4<br>&emsp;}<br>}</td>
    </tr>
  </table>
</details>

## Miscellaneous

### Source ID

> Perform action if event is from a specific source

1. Do something if event from specified source
2. Return event

```javascript
export function transformEvent(event, metadata) {
    if (metadata(event).sourceId === "12345") {
        // Do something
    }
    return event;
}
```

### Change Event Type

> Change the type of an event (track to identify in this example)

1. Change event from `track` to `identify` if conditions are met
2. Return event

```javascript
export function transformEvent(event) {
    let updatedEvent = event;
    if (
        event.type === "track" && 
        event.event === "ide-authentication" && 
        event.properties?.email && 
        event.properties.email !== ""
    ) {
        updatedEvent.type = "identify";
        let updatedContext = event.context || {}; 
        updatedContext.traits = updatedContext.traits || {};
        updatedContext.traits.email = event.properties.email;
        updatedEvent.context = updatedContext;
    }
   return updatedEvent;
}
```

<details>
  <summary>Example Input and Output</summary>
  <table>
    <tr>
      <th>Input</th>
      <th>Output</th>
    </tr>
    <tr>
      <td valign="top">{<br>&emsp;"type": "track",<br>&emsp;"event": "ide-authentication",<br>&emsp;"properties": {<br>&emsp;&emsp;"email": "john@gmail.com"<br>&emsp;}<br>}</td>
      <td>{<br>&emsp;"type": "identify",<br>&emsp;"event": "ide-authentication",<br>&emsp;"properties": {<br>&emsp;&emsp;"email": "john@gmail.com"<br>&emsp;},<br>&emsp;"context": {<br>&emsp;&emsp;"traits": {<br>&emsp;&emsp;&emsp;"email": "john@gmail.com"<br>&emsp;&emsp;}<br>&emsp;}</td>
    </tr>
  </table>
</details>

### Batch

> Perform action for each event in a batch

1. Do something for each event
2. Return events

```javascript
export function transformBatch(events, metadata) {
    events.forEach(event => {
        // Do something
    });
    return events;
}
```

## License

[MIT](LICENSE)