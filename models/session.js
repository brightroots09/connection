module.exports = {
    sql_session: async () => {
        try {
            await con.query(`
           CREATE TABLE if not exists Session (
            sessionId varchar(450) not null primary key,
            sessionData varchar(1000) null,
            lastTouchedUtc datetime not null
          )
          
           `);
        } catch (error) {
            console.log(error);
        }

    }

}