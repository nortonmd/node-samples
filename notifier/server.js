const { Client } = require('pg');
const jsforce = require('jsforce');

const conn = new jsforce.Connection({});

let {
    DATABASE_URL
} = process.env;

DATABASE_URL += '?ssl=true';

const client = new Client(DATABASE_URL);

(async() => {
    await conn.login('ssh@u-haul.demo', 'abc123abc');
    await client.connect((error, client) => {
        if(error) throw error;
        
        client.on('notification', async ({ payload }) => {
            const { data } = JSON.parse(payload);
            const sfData = Object.keys(data).reduce((accum, key) => {
                if(key == 'first_name') {
                    accum['first_name__c'] = data[key];
                } else if(key == 'last_name') {
                    accum['last_name__c'] = data[key];
                } else if(key == 'status') {
                    accum['status__c'] = data[key];
                } else if(key == 'customer_id') {
                    accum['customer_id__c'] = data[key];
                } else if(key == 'date') {
                    accum['date__c'] = data[key];
                }

                return accum;

            }, {});

            console.log(sfData);
            await conn.sobject('Customer__e').create(sfData);
            
        });
    
        client.query('LISTEN ##########');
    
    });
})();