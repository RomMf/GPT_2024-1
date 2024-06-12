const mqtt = require('mqtt');

const brokerUrl = 'ws://34.121.97.129:8083/mqtt';
const options = {
    clean: true,
    clientId: "control" + Math.random().toString(16).substring(2, 8),
    username: 'autito_app',
    password: 'autito_app',
    protocolVersion: 5,
};

const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    const topic = 'autito/test';
    const message = 'Hola, autito!';
    client.publish(topic, message, (error) => {
        if (error) {
            console.error('Error al enviar el mensaje:', error);
        } else {
            console.log('Mensaje enviado correctamente');
        }
    });
});

client.on('error', (error) => {
    console.error('Error connecting to MQTT broker:', error);
});


