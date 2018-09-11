module.exports = {
    sql_services_list : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists ServicesList (
            Id int(11) NOT NULL,
            Name varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            Image varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}