module.exports = {
    sql_user : async ()=>{
       try {
           await con.query(`
           CREATE TABLE if not exists User (
            Id int(11) NOT NULL,
            Fname varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            Lname varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            Email varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            Password text COLLATE utf8mb4_unicode_ci,
            ContactNo varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            ProfilePic text COLLATE utf8mb4_unicode_ci NOT NULL,
            CompanyName text COLLATE utf8mb4_unicode_ci NOT NULL,
            Address text COLLATE utf8mb4_unicode_ci NOT NULL,
            LicenceNo varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            LicenceImage text COLLATE utf8mb4_unicode_ci NOT NULL,
            NoOfTechnicians varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            OtherCertificate text COLLATE utf8mb4_unicode_ci NOT NULL,
            Skill varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            UserType varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            DeviceId text COLLATE utf8mb4_unicode_ci NOT NULL,
            DeviceType varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
            Latitude varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            Longitude varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            Country varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
            Experience int(11) NOT NULL,
            services_provided text COLLATE utf8mb4_unicode_ci NOT NULL,
            services_names text COLLATE utf8mb4_unicode_ci NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
          
           `);
       } catch (error) {
           console.log(error);
       }
     
   } 
    
}