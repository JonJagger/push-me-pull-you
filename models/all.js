
Games = new Meteor.Collection('games');
/*
 * Games.insert({
 *   gid: '138ef8'        // game-id
 * });
 */    

Edges = new Meteor.Collection('edges');
/*
 * Edges.insert({
 *      gid: '138ef8', // game-id
 *   colour: 'red'     // of the containing kanban
 * });
 */

Stories = new Meteor.Collection('stories');
/*
 *    Stories.insert({
 *         gid: '138ef8',          // game-id
 *      colour: 'red',             // of the containing kanban
 *        ones: '11',              // no of 1s already worked on this story (2)
 *        size: '111'              // no of 1s on this story till its Done (3)
 *      });
 */
