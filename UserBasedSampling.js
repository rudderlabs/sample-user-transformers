// hash function courtsey bryc https://gist.github.com/bryc
function hash(s) {
  let h = 0xdeadbeef;
  for (let i = 0; i < s.length; i += 1)
    h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
  return (h ^ (h >>> 16)) >>> 0;
}

function transform(events) {
  // random select events based on users
  const filteredEvents = events.filter(event => {
    const userId =
      event.context && event.context.traits && event.context.traits.userId; // assumes userId field within traits
    if (userId) {
      return hash(userId) % 10 > 5;
    }

    return true;
  });

  return filteredEvents;
}
