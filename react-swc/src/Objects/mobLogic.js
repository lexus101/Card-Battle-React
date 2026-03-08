// A simple definition of what a pattern should do
class IntentPattern {
  // Returns the next intent object based on the last known time
  generateNext(lastTime) {
    throw new Error("Not implemented");
  }
}

export class LoopPattern extends IntentPattern {
  constructor(moves) {
    super();
    this.moves = moves; // e.g., [{card: 'Attack', time: 2}, {card: 'Defend', time: 3}]
    this.currentIndex = -1;
  }

  generateNext() {
    const next_intent = []
    do { 
      this.currentIndex = (this.currentIndex + 1) % this.moves.length;
      next_intent.push( this.moves[this.currentIndex] )
    } while (this.moves[this.currentIndex].time == 0)

    // next_intent.push( this.moves[this.currentIndex] )
    // this.currentIndex = (this.currentIndex + 1) % this.moves.length;

    return next_intent;
  }
}

export class RandomPattern extends IntentPattern {
  constructor(moves){
    super()
    this.moves = moves;
    this.r = moves.length;
  }
  generateNext() {
    const next_intent = this.moves[Math.floor(Math.random()*this.r)]
    return next_intent
  }
}