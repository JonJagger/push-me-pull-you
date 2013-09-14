
Games = new Meteor.Collection('games');
/*
 * Games.insert({
 *     gid: '138ef8'   // game-id
 * });
 */    

Edges = new Meteor.Collection('edges');
/*
 * Edges.insert({
 *     gid: '138ef8', // game-id
 *   color: 'red'     // of the game
 * });
 */

Stories = new Meteor.Collection('stories');
/*
 * Stories.insert({
 *     gid: '138ef8',  // game-id
 *   color: 'red',     // of the containing kanban
 *    ones: '2',       // no of 1s already worked
 *    size: '3'        // no of 1s on this story
 * });
 */
