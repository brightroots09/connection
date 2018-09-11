module.exports = {
    sql_services_function : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists ServicesFunction (
            ID int(11) NOT NULL,
            ServicesID int(11) NOT NULL,
            ContractorID int(11) NOT NULL,
            TechnicianID int(11) NOT NULL,
            Status int(11) NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}