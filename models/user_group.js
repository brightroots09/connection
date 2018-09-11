module.exports = {
    sql_user_group : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists UserGroup (
            GroupID int(11) NOT NULL,
            UserID int(11) NOT NULL,
            MemberID text COLLATE utf8mb4_unicode_ci NOT NULL,
            GroupName varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            GroupImage text COLLATE utf8mb4_unicode_ci NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}