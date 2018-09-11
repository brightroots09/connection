module.exports = {
    sql_token : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists Token (
            Id int(11) NOT NULL,
            Token text COLLATE utf8mb4_unicode_ci NOT NULL,
            UserId int(11) NOT NULL,
            ExpiresIn varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}