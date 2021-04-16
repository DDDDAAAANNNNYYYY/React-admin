/*

*/
import store from 'store'
const USER_KEY = 'user_key'
 //eslint-disable-next-line
export default{
    /*
    保存user
    */
   saveUser(user){
    //    localStorage.setItem(USER_KEY,JSON.stringify(user))
    store.set(USER_KEY,user)
},
   /*
   读取user
   */
    getUser(){
    //   return JSON.parse(localStorage.getItem(USER_KEY)||'{}')
  return store.get(USER_KEY)||{}
},
  /*
  删除user
  */
 deleteUser(){
    //  localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
 },

 saveList(list) {
   store.set("TimeList", list)
 },
 getList() {
   return store.get("TimeList") || {}
 },
 saveIndex(index){
   store.set("Index", index);

 },
 getIndex(){
  return store.get("Index") || 0;

}

}

