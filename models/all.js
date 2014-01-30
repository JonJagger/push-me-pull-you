
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
 *   teamColor: "red",
 *       state: "pullable", // "pulled","in-progress","pushable","pushed"
 *       color: "red",      // of the kanban
 *        size: "4",        // of in-progress filled-kanban
 *        ones: "2"         // done (out of size)
 * });
 */

