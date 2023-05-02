
## Examples

- [Filtering](#filtering)
  - [Denylist Event Names](#denylist-event-names)
  - [Allowlist Email Domains](#allowlist-email-domains)
- [Enrichment](#enrichment)
  - [Geolocation Data](#geolocation-data)
  - [User Data](#user-data)
  - [User Agent Data](#user-agent-data)
  - [Dynamic Header](#dynamic-header)
  - [Dynamic Path](#dynamic-path)
- [Miscellaneous](#miscellaneous)
  - [Source ID](#source-id)
  - [Change Event Type](#change-event-type)
  - [Batch](#batch)

## Filtering

### Denylist Event Names

> Filter out event if a property (event name in this example) is included in a denylist.

1. Drop event if denylist includes event name
2. Return event otherwise

```python
def transformEvent(event, metadata):
    eventNames = ["game_load_time", "lobby_fps"]
    eventName = event["event"]
    if eventName in eventNames:
        return
    return event
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

### Allowlist email domains

> Filter out event if a property (email domain in this example) is not included in a allowlist.

1. Return event if allowlist includes email domain
2. Drop event otherwise

```python
def transformEvent(event, metadata):
    domains = ["rudderstack.com", "rudderlabs.com"];
    email = event.get("context", {}).get("traits", {}).get("email");
    if email and email.split("@").pop() in domains:
        return event
    return
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

## Enrichment

### Geolocation data

> Enrich event with geolocation data using an external API and IP address

1. Fetch geolocation data from external IP2Location API
2. Add data to event
3. Return event

```python
import requests

def transformEvent(event, metadata):
    if event.get("request_ip"):
        res = requests.get("<YOUR_API_ENDPOINT>" + event["request_ip"]) # Use your paid IP-to-geolocation API endpoint.
        if res.status_code == 200:
            event["context"]["geolocation"] = res.json();
    return event
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

### User data

> Enrich event with user data using an external API and email address

1. Get user data from external Clearbit API
2. Add data to event's traits
3. Return event

```python
import requests

def function transformEvent(event):
    const email = event.get("context", {}).get("traits", {}).get("email")
    if email:
        res = requests.get("https://person.clearbit.com/v2/combined/find?email=" + email, {
            headers: {
                "Authorization": "Bearer <your_clearbit_secure_key"
            }
        })
        if res.status_code == 200:
            event["context"]["traits"]["enrichmentInfo"] = res.json()
    return event
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

### Dynamic header

> Add a dynamic header to event payload

1. Add dynamnic header to event
2. Return event

```javascript
def transformEvent(event, metadata):
    event["header"] = {
        "dynamic_header_1": "dynamic_header_1_value",
        "dynamic_header_2": "dynamic_header_2_value"
    }
    return event
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

### Dynamic path

> Dynamically append the event endpoint

1. Add dynamic path to event's endpoint base URL
2. Return event

```python
def transformEvent(event, metadata):
    email = event.get("context", {}).get("traits", {}).get("email")
    if email:
        event["appendPath"] = f"/search?email={email}";
    return event
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

## Miscellaneous

### Source ID

> Perform action if event is from a specific source

1. Do something if event from specified source
2. Return event

```python
def transformEvent(event, metadata):
    meta = metadata(event)
    if meta["sourceId"] == "12345":
        # Do something
    return event
```

### Change event type

> Change the type of an event (track to identify in this example)

1. Change event from `track` to `identify` if conditions are met
2. Return event

```python
def transformEvent(event, metadata):
    updatedEvent = event
    if (
        event["type"] == "track" and
        event["event"] == "ide-authentication" and
        event.get("properties", {}).get("email") 
    ):
        updatedEvent["type"] = "identify"
        updatedContext = event.get("context", {}) 
        updatedContext["traits"] = updatedContext.get("traits", {})
        updatedContext["traits"]["email"] = event["properties"]["email"]
        updatedEvent["context"] = updatedContext
    return updatedEvent
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
def transformBatch(events, metadata):
    for event in events:
        # Do something
    return events
```

## License

[MIT](LICENSE)
