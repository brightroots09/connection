module.exports = {
    sql_invoice : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists Invoice (
            InvoiceID int(11) NOT NULL,
            UserID int(11) NOT NULL,
            JobID int(11) NOT NULL,
            Amount varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}