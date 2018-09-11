module.exports = {
    sql_estimation_setting : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists EstimationSetting (
            ID int(11) NOT NULL,
            UserID int(11) NOT NULL,
            PricePerHour varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            TravelCharges varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            TruckCharges varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            ETA varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            DiagnosticCharges varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}