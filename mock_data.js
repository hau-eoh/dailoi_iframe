// MOCK SCRIPT FOR LOCAL TESTING
// This script simulates the postMessage data sent by the E-Ra platform to the iFrame widget.

setTimeout(() => {
    console.log("Mocking E-Ra Configuration Payload...");
    
    // Simulate Configuration Message
    const configMessage = {
        type: "configurations",
        data: {
            "realtime_configs": [
                { "id": 100, "name": "Level" },
                { "id": 101, "name": "Pressure" },
                { "id": 102, "name": "Flow" },
                { "id": 103, "name": "Voltage" },
                { "id": 104, "name": "Current" },
                { "id": 105, "name": "Energy" },
                { "id": 106, "name": "PumpStatus" }
            ],
            "history_configs": [],
            "actions": [
                { "action": "urn:era:action:pump_on", "name": "ON" },
                { "action": "urn:era:action:pump_off", "name": "OFF" }
            ]
        }
    };
    window.postMessage(configMessage, "*");

    // Simulate Values Messages
    let mockLvl = 50;
    let pumpRunning = 0;
    let energyTotal = 100.5;

    // Listen for mock actions
    window.addEventListener("message", (e) => {
        if(e.data?.type === "trigger_action") {
            const act = e.data.data.action;
            if(act === "urn:era:action:pump_on") pumpRunning = 1;
            if(act === "urn:era:action:pump_off") pumpRunning = 0;
            console.log("MOCK: Action triggered:", act);
        }
    });

    setInterval(() => {
        // Vary the values slightly
        if(pumpRunning) {
            mockLvl = Math.max(0, mockLvl - 0.5); // Level drops
            energyTotal += 0.05;
        } else {
            mockLvl = Math.min(100, mockLvl + 2); // Level fills up
        }

        const valuesMessage = {
            type: "values",
            data: {
                "100": { "value": mockLvl },
                "101": { "value": pumpRunning ? 5.2 + Math.random()*0.4 : 0 },
                "102": { "value": pumpRunning ? 25.0 + Math.random()*2 : 0 },
                "103": { "value": 220.0 + Math.random()*5 },
                "104": { "value": pumpRunning ? 15.0 + Math.random()*1 : 0.0 },
                "105": { "value": energyTotal },
                "106": { "value": pumpRunning } 
            }
        };
        window.postMessage(valuesMessage, "*");
    }, 1000);

}, 1000); // Wait 1 second before starting to emulate load time
