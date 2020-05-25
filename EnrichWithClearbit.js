async function transform(events) {
    

    const enrichedEvents = [];
    
	//Add an enrichment object (from Clearbit) to traits for the email provided
    await Promise.all(events.map(async (e) => {

        const email = e.context && e.context.traits && e.context.traits.email;
        
        if (email) {
            const res =	await fetch('https://person.clearbit.com/v2/combined/find?email='+email, {headers: {'Authorization': 'Bearer <your_clearbit_secure_key'}});
            e.context.traits.enrichmentInfo = res;
        }
        
        enrichedEvents.push(e)
        
    }));
    
    return enrichedEvents;
}