export function transformEvent(event) {
    //sample based on userId
    const userId = event.context && event.context.traits && event.context.traits.userId; //assumes userId field within traits
    if (userId){
        if ((hash(userId) % 10) < 5){
            return; // returns undefined if remainder is less than 5
        }
    }
    return event;
}


//hash function courtsey bryc https://gist.github.com/bryc
function hash(s) {
    let h;
    for(let i = 0, h = 0xdeadbeef; i < s.length; i++)
        h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    return (h ^ h >>> 16) >>> 0;
};
