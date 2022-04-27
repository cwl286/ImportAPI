/*
 * Create the collection of api keys
 * mimic a DB table
 * apikeys {key, userid}
 */
 const apikeys = new Map();
 apikeys.set('AbHTJFYu0QDsr9u6Ax0i', 1);
 apikeys.set('tvaCC7fADyeazz1SsrLx', 2);
 
 /**
  * Create the collection of users
  * mimic a DB table
  * user {id, {details}}
  */
 const users = new Map();
 users.set(1, {
   id: 1,
   name: 'admin',
 });
 users.set(2, {
   id: 2,
   name: 'test',
 });
 
 module.exports = {
   users: users,
   apikeys: apikeys,
 };
