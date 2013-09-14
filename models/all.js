
Games = new Meteor.Collection('games');
/*
 * Games.insert({
 *     gid: '138ef8'   // game-id
 * });
 */    

Edges = new Meteor.Collection('edges');
/*
 * Edges.insert({
 *         gid: '138ef8',
 *   teamColor: 'red'
 * });
 */

Stories = new Meteor.Collection('stories');
/*
 * Stories.insert({
 *           gid: '138ef8',
 *     teamColor: 'blue' 
 *   kanbanColor: 'red',
 *          ones: '2',       // number of 1s already worked
 *          size: '3'        // number of 1s on this story
 * });
 */
