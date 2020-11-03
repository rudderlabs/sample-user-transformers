async function transform(events) {
    

    const enrichedEvents = [];
    
    await Promise.all(events.map(async (e) => {

        if (e.request_ip) {
			//specify your IP2Location API key. Also mention the addon and package as per your need. Other parameters can also be added as specified in https://www.ip2location.com/web-service/ip2location
            const res =	await fetch('https://api.ip2location.com/v2/?ip='+e.request_ip.trim()+'&addon=<required addon e.g.geotargeting>&lang=en&key=<IP2Location_API_Key>&package=<package as required e.g. WS10>');
            e.geolocation = res;
        }
        
        enrichedEvents.push(e)
        
    }));
    
    return enrichedEvents;
}

