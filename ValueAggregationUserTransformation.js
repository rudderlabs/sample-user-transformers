// in the below example, aggregation of three attributes - 'bet_amount', 'win_amount' and 'no_of_spin'
// for all 'spin_result' events in the batch is being performed and instead of N 'spin_result' events,
// a single 'spin_result' event with cumulative values is being provided
function transform(events) {
  const spinResultEvents = events.filter(event => {
    return event.event === "spin_result";
  });
  let betAmount = 0;
  let winAmount = 0;
  let noOfSpin = 0;

  // sum these props

  spinResultEvents.forEach(spEvent => {
    betAmount += spEvent.properties.bet_amount
      ? spEvent.properties.bet_amount
      : 0;
    winAmount += spEvent.properties.win_amount
      ? spEvent.properties.win_amount
      : 0;
    noOfSpin += spEvent.properties.no_of_spin
      ? spEvent.properties.no_of_spin
      : 0;
  });

  // modify the first spin_result_event
  if (spinResultEvents.length > 0) {
    spinResultEvents[0].properties.bet_amount = betAmount;
    spinResultEvents[0].properties.win_amount = winAmount;
    spinResultEvents[0].properties.no_of_spin = noOfSpin;
  }

  // other than spin event
  let otherEvents = events.filter(event => {
    return event.event !== "spin_result";
  });

  if (otherEvents.length === 0) {
    otherEvents = [];
  }

  // add a single spin event

  if (spinResultEvents.length > 0) {
    otherEvents.push(spinResultEvents[0]);
  }

  return otherEvents;
}
