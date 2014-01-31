
Template.kanban.voidGaps = function() {
  return nOnes(0);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// If a story's size is 4 and it has had 4 ones played
// on it then it has no white gaps.
// If a story's size is 4 and it has had 3 ones played
// on it then it has one white gap.
// see {{#each whiteGaps}} in kanban.html
//
Template.kanban.whiteGaps = function() {
  return nOnes(this.size - this.ones.length);
};

//- - - - - - - - - - - - - - - - - - - - - - - - - - - -
// The number of ones that have been played on a story.
// see kanban.html
//

Template.kanban.onesColors = function() {
  if (this.ones == "") {
    return ","; // HACK, returning "" causes kanban.html to emit ...data-ones>
  } else {                         // rather than ...data-ones="">
    return this.ones;              // and I don't know why
  }
};

var nOnes = function(n) { // eg 3
  return _(n).times(function() { return 1; });  // eg [1,1,1]
};

