module.exports = {
    sql_admin : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists admin (
            Id int(11) NOT NULL PRIMARY KEY,
            Name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            Email varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            Password text COLLATE utf8mb4_unicode_ci,
            ProfilePic text COLLATE utf8mb4_unicode_ci
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}