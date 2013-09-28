
Games = new Meteor.Collection('games');
/*
 * Games.insert({
 *     gid: "138ef8"   // game-id
 *    mode: "push"     // or "pull"
 * });
 */    

Teams = new Meteor.Collection('teams');
/*
 * Teams.insert({
 *     gid: "138ef8",
 *   color: "red"
 * });
 */

Kanbans = new Meteor.Collection('kanbans');
/*
 * Kanbans.insert({
 *         gid: "138ef8",
 *   teamColor: "blue",
 *       color: "red",     // of the kanban
 *        size: "4",       // of the kanban
 *   storySize: "3",       // number of 1s in this story
 *        ones: "2"        // number of 1s played so far
 *          at: "wip"      // or "upstream" or "downstream"
 * });
 */

Dice = new Meteor.Collection('dice');
/*
  * Dice.insert({
 *         gid: "138ef8",
 *   teamColor: "blue",
 *       color: "red",
 *       value: "3"
 * });
 */
