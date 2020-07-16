function transform(events) {
	
	//Populate generic User-Agent property if same has not been populated from client side
	//Also reduce batch size to desired limit by randomly selecting events
    const IOS_USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
    const ANDROID_USER_AGENT = "Dalvik/2.1.0 (Linux; U; Android 9; Mi A3 Build/PKQ1.190416.001)";
    const IOS_PRESENT_UA = "ios";
    
	
	const destination = events[0].destination;
    
	let GAbatchLengthToSend = 5; //set whatever size you want to set in the reduced batch
	
	
    events.map(event => {
		
		//sometimes developers might populate certain crucial attributes within nested structures and not under the 
		//root. Copy the values to the desired level for such cases
        let anonymousId = event.anonymousId;
        if (!anonymousId) {
            anonymousId = event.context.traits.anonymousId;
        }
        let eventName = event.event;
        let userId;
        if (event.userProperties) {
            userId = event.userProperties.user_id;
        }
		
		//if userId is present, then use the same for anonymousId
        event.anonymousId = userId || anonymousId;
        event.context.traits.anonymousId = userId || anonymousId;
        event.userId = userId || anonymousId;
		
		//create structures for user properties and event properties if missing
        if (!event.properties) {
            event.properties = {};
        }
        if(!event.userProperties) {
            event.userProperties = {}
        }
		
		//if User-Agent is missing, populate the same based on platform
        event.properties.category = event.properties.category ? event.properties.category : eventName;
        let userAgent = event.context.userAgent;
        if (userAgent === undefined || userAgent === null || userAgent.length === 0) {
            let platform;
            platform = event.context.library.name;
            platform = platform.indexOf("android") >= 0 ? "Android" : "iOS";
            event.context.userAgent = platform == "iOS"
                ? IOS_USER_AGENT
                : ANDROID_USER_AGENT;
        } 
        
        // replace "," with empty string for now
        event.context.userAgent = event.context.userAgent.replace(",", "");
        
         // store the user-agent as a property
        event.properties["user-agent"] = event.context.userAgent;
        
        let ups = Object.keys(event.userProperties);
        ups.forEach(up => {
            if(!event.properties[up]) {
                event.properties[up] = event.userProperties[up];
            }
        });
        return event;
    });
    
    //evenly sort/shuffle events
    const shuffledList = events.sort(
        () => 0.5 - Math.random()
    );
	
	//prepare a reduced size batch
    const listToSend = shuffledList.splice(0, GAbatchLengthToSend);
    return listToSend;
}