module.exports = {
    sql_request : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists Request (
            RequestID int(11) NOT NULL,
            UserOne int(11) NOT NULL,
            UserTwo int(11) NOT NULL,
            Status int(11) NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}