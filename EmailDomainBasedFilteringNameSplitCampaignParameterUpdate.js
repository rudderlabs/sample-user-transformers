//Sample user transformation to 
// - Filter out events triggered by users having particular e-mail domain e.g. that of the installation owner enterprise
// - Split Full Name into First and Last Names
// - Add UTM parameters to context.traits object for subsequent processing by 
//   campaign-oriented destination transformations (e.g. MailChimp)

function transform(events) {
	
  //filter out events triggered by users having particular e-mail domain e.g. rudderlabs	
  const filteredEvents = events.filter((e) => {
      const email = e.context && e.context.traits && e.context.traits.email;
      if(email){
          const domain = email.substring(email.lastIndexOf("@") +1);
          if(domain === 'rudderlabs.com') return false    
      }
      return true;
  });
  
  //where full name is provided as part of context.traits.name - split into first and last names
  const eventsWithNameDetails = filteredEvents.map((e) => {
     
    // Splitting name and first name and last name  
    const fullName = e.context && e.context.traits && e.context.traits.name;
    if(fullName) {
        const fullNameSplit = fullName.trim().split(' ');
        e.context.traits.fName = fullNameSplit[0];
        e.context.traits.lName = fullNameSplit.length > 1 ? fullNameSplit.slice(1, fullNameSplit.length).join(" ") : 'NA';
    }
    
    // Adding company as 'NA' if company is not given
    const pagcontextPath = e.context && e.context.page && e.context.page.path
    const company = e.context && e.context.traits && e.context.traits.company;
    // since we don't send traits info during login,don't update any traits
    if(pagcontextPath != '/login' && pagcontextPath != '/verify') {
         e.context.traits.company = company || 'NA';
    } 
   
    
    //Parse page URL to determine if UTM related parameters have been passed
	//If found, then extract the same and populate related parameters under context.traits structure
	//Transformers for campaign-oriented Destinations like MailChimp can then use these parameters for
	//appropriate Destination invocation construction
    const searchParams = e.context.page ? e.context.page.search : undefined;
    if(searchParams) {
        const indvSearchParams = searchParams.trim().split('&');  // ?test1=val1&test2=val2
        if(indvSearchParams.length > 0) {
            const firstSearchString = indvSearchParams[0].slice(1, indvSearchParams[0].length); // remove the preceding '?'
            indvSearchParams[0] = firstSearchString;
            
            indvSearchParams.forEach(valSearch => {
                var keyValPairs = valSearch.split("="); // seperate key and val
                if(keyValPairs[0].length > 0) {
                    if(!e.context.traits) {
                        e.context.traits = {};
                    }
                    // will be e.context.traits[keyValPairs[0]] = keyValPairs[1], for now keeping key "UTM" and overiding
                    if (keyValPairs[0] === 'type') {
                        e.context.traits["UTM"] = keyValPairs[1]; 
                    }
                    if (keyValPairs[0] === 'utm_campaign') {
                        e.context.traits["UTMCMPG"] = keyValPairs[1]; 
                    }
                    
                }
            })
        }
         
    }
    
    return e;
  });
  return eventsWithNameDetails;
}
