module.exports = {
     sql_chat : async ()=>{
        try {
            await con.query(`
            CREATE TABLE if not exists Chat (
                ChatID int(11) NOT NULL,
                UserID int(11) NOT NULL,
                FriendID text COLLATE utf8mb4_unicode_ci NOT NULL,
                Message text COLLATE utf8mb4_unicode_ci NOT NULL,
                Image text COLLATE utf8mb4_unicode_ci NOT NULL,
                DateTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UserName varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                UserImage text COLLATE utf8mb4_unicode_ci NOT NULL,
                ChatType varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                GroupID int(11) NOT NULL
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `);
        } catch (error) {
            console.log(error);
        }
      
    } 
     
}