export async function transformEvent(event) {
    const enrichedEvent = event;
	//Add an enrichment object (from Clearbit) to traits for the email provided
    const email = event.context && event.context.traits && event.context.traits.email;
    if (email) {
        const res =	await fetch('https://person.clearbit.com/v2/combined/find?email='+email, {headers: {'Authorization': 'Bearer <your_clearbit_secure_key'}});
        enrichedEvent.context.traits.enrichmentInfo = res;
    }
    return enrichedEvent;
}