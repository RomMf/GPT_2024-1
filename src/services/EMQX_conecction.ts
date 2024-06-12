import mqtt from 'mqtt';
import { EventEmitter } from 'events';
import { version } from 'react';

class EMQXConnection extends EventEmitter {
    client: mqtt.MqttClient;
    private status: string;
    
    constructor() {
        super();
        const brokerUrl = 'ws://34.121.97.129:8083/mqtt';
        const options = {
            clean: true,
            clientId: "control" + Math.random().toString(16).substring(2, 8),
            username: 'autito_app',
            password: 'autito_app',
            protocolVersion: 5,
        };
        this.client = mqtt.connect(brokerUrl, options);

    }

    public get connectionStatus(): string {
        return this.status;
    }

    public connectToMqtt() {
        console.log('Connecting to MQTT WebSocket');
        this.status = 'connecting'; 
        
        this.client.subscribe("autito/#");

        this.client.on('connect', () => {
            console.log('Connected to MQTT WebSocket');
            this.status = 'connected'; 
            this.emit('statusChange', this.status);

        });

        this.client.on('message', (topic, message) => {
            console.log(`Received message on topic: ${topic}`);
            console.log(`Message: ${message.toString()}`);
        });

        this.client.on('error', (error) => {
            console.error('Error connecting to MQTT WebSocket:', error);
            this.status = 'error'; 
            this.emit('statusChange', this.status);


        });
    }

    public sendMessage(topic: string, message: string) {

        this.client.publish("autito/#", message, (error) => {
            if (error) {
              console.log("Publish error: ", error);
            }else{
                console.log("Published message: ", message);
                
            }
          });
    }
    
}

export default EMQXConnection;