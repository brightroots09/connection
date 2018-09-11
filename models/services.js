module.exports = {
    sql_services : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists Services (
            ID int(11) NOT NULL,
            USERID int(11) NOT NULL,
            ADDRESS text COLLATE utf8mb4_unicode_ci NOT NULL,
            LAT varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            LNG varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            URGENCY varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            PROBLEM text COLLATE utf8mb4_unicode_ci NOT NULL,
            DESCRIPTION text COLLATE utf8mb4_unicode_ci NOT NULL,
            SERVICEID varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            SERVICENAME varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}