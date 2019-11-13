const cors = require('cors');
const faker = require('faker');
const moment = require('moment');
const express = require('express');
const { Kafka } = require('kafkajs');
const bodyParser = require('body-parser');

const {
    KAFKA_URL,
    KAFKA_TRUSTED_CERT,
    KAFKA_CLIENT_CERT_KEY,
    KAFKA_CLIENT_CERT,
    PORT
} = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

  const producer = kafka.producer();

  (async () => {
    await producer.connect();

    setInterval(async () => {

        const data = {
            last_name: faker.name.lastName(),
            customer_id: faker.random.uuid(),
            first_name: faker.name.firstName(),
            status: ['pickup', 'delivery', 'shipping'][Math.floor(Math.random()*10)%3],
            date: moment(faker.date.between('2015-01-01', '2015-12-31')).format('YYYY-MM-DD')
        }

        await producer.send({
            topic: 'customer-reservations',
            messages: [
                { value: JSON.stringify(data) }
            ]
        });
    }, 1000);

    app.post('/submit', async (req, res) => {
        
        req.body.date = moment(req.body.date).format('YYYY-MM-DD');

        await producer.send({
            topic: 'customer-reservations',
            messages: [
                { value: JSON.stringify(req.body) }
            ]
        });

        res.redirect('https://##########-form.herokuapp.com?success=true');
        
    });

  })();

  app.listen(PORT || 8080);