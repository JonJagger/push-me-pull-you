
Games = new Meteor.Collection('games');
/*
 * Games.insert({
 *     gid: "138ef8"   // game-id
 * });
 */    

Teams = new Meteor.Collection('teams');
/*
 * Teams.insert({
 *     gid: "138ef8",
 *   color: "red"
 * });
 */

Stories = new Meteor.Collection('stories');
/*
 * Stories.insert({
 *           gid: "138ef8",
 *     teamColor: "blue",
 *   kanbanColor: "red",
 *    kanbanSize: "4",
 *          size: "3"        // number of 1s on this story
 *          ones: "2",       // number of 1s already worked
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
