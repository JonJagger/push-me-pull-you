
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

Kanbans = new Meteor.Collection('kanbans');
/*
 * Kanbans.insert({
 *         gid: "138ef8",
 *   teamColor: "red",      // of the wip area kanban is in
 *       state: "pullable", // "pulled","in-progress","pushable","pushed"
 *       color: "red",      // of the kanban
 *        size: "4",        // of the kanban's story
 * });
 */

