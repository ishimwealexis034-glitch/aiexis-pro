// Connect to HiveMQ's public WebSocket broker (No account required)
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

const statusEl = document.getElementById('connection-status');
const tempEl = document.getElementById('temp-val');
const humEl = document.getElementById('hum-val');
const greenBadge = document.getElementById('green-badge');
const redBadge = document.getElementById('red-badge');

client.on('connect', () => {
    statusEl.innerText = "Status: Connected";
    statusEl.style.color = "#28a745";
    
    // Subscribe to the exact topic your ESP32 publishes to
    client.subscribe('esp32/alexis/sensors', (err) => {
        if (err) {
            console.error("Subscription error", err);
        }
    });
});

client.on('error', (err) => {
    console.error("MQTT connection error: ", err);
    statusEl.innerText = "Status: Connection Error";
});

client.on('message', (topic, message) => {
    try {
        // Parse incoming JSON payload from ESP32
        const data = JSON.parse(message.toString());
        
        // Update text elements
        tempEl.innerText = data.temperature;
        humEl.innerText = data.humidity;

        // Update Green LED indicator badge
        greenBadge.innerText = data.greenLed;
        greenBadge.className = "badge " + (data.greenLed === "HIGH" ? "bg-high" : "bg-low");

        // Update Red LED indicator badge
        redBadge.innerText = data.redLed;
        redBadge.className = "badge " + (data.redLed === "HIGH" ? "bg-high" : "bg-low");
    } catch (e) {
        console.error("Failed to parse JSON:", e);
    }
});