const { Kafka } = require('kafkajs');

const {
    KAFKA_URL,
    KAFKA_TRUSTED_CERT,
    KAFKA_CLIENT_CERT_KEY,
    KAFKA_CLIENT_CERT,
    DATABASE_URL
} = process.env;

const kafka = new Kafka({
    clientId: 'u-haul',
    brokers: KAFKA_URL.replace(/kafka\+ssl:\/\//g, '').split(','),
    ssl: {
        rejectUnauthorized: false,
        ca: [KAFKA_TRUSTED_CERT],
        key: KAFKA_CLIENT_CERT_KEY,
        cert: KAFKA_CLIENT_CERT
    }
});

const consumer = kafka.consumer({ groupId: 'u-haul' });

const knex = require('knex')({
    client: 'postgres',
    connection: DATABASE_URL + '?ssl=true'
});

(async () => {
    await knex.raw('select 1+1 as result');
    await consumer.connect();
    await consumer.subscribe({ topic: 'customer-reservations' });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try{
                await knex.withSchema('##########').from('customer-reservations').insert(JSON.parse(message.value.toString()))
            } catch(excpetion) {
                console.log('==========CATCH==========');
                console.log(excpetion);
            }
        }
    });
})();