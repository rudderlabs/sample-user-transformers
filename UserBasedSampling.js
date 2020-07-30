function transform(events) {
    
    //random select events based on users
    var filteredEvents = events.filter(function(event) {
        var userId = event.context && event.context.traits && event.context.traits.userId; //assumes userId field within traits
        if (userId){
            return ((hash(userId) % 10) > 5) ;
        }
        
        return true;
    });
    
    return filteredEvents;
  
}


//hash function courtsey bryc https://gist.github.com/bryc  
var hash = function(s) {
    for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
        h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    return (h ^ h >>> 16) >>> 0;
};
