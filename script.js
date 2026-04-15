// Node References
const nodes = {
    levelText: document.getElementById('valLevel'),
    levelFill: document.getElementById('waterLevelFill'),
    pressureText: document.getElementById('valPressure'),
    flowText: document.getElementById('valFlow'),
    voltageText: document.getElementById('valVoltage'),
    voltageBar: document.getElementById('barVoltage'),
    currentText: document.getElementById('valCurrent'),
    currentBar: document.getElementById('barCurrent'),
    energyText: document.getElementById('valEnergy'),
    pumpGraphic: document.getElementById('pumpGraphic'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    btnPumpOn: document.getElementById('btnPumpOn'),
    btnPumpOff: document.getElementById('btnPumpOff'),
    connStatus: document.getElementById('connectionStatus')
};

// State Variables
let configs = [];
let actions = [];
let currentPumpStatus = null;

// Initialize E-Ra Widget
const eraWidget = new EraWidget();

eraWidget.init({
    needRealtimeConfigs: true, 
    needHistoryConfigs: false,
    needActions: true, 
    maxRealtimeConfigsCount: 7, 
    maxHistoryConfigsCount: 0, 
    maxActionsCount: 2, 
    minRealtimeConfigsCount: 7, 
    minHistoryConfigsCount: 0, 
    minActionsCount: 1, 

    onConfiguration: (configuration) => {
        // configuration.realtime_configs should have 7 items
        configs = configuration.realtime_configs;
        // configuration.actions should have 2 items (On and Off)
        actions = configuration.actions;
        nodes.connStatus.textContent = 'Đã kết nối E-Ra';
    },

    onValues: (values) => {
        if(configs.length < 7) return;

        // 0: Level
        const levelVal = values[configs[0].id]?.value ?? 0;
        nodes.levelText.textContent = levelVal.toFixed(1);
        nodes.levelFill.style.height = Math.min(Math.max(levelVal, 0), 100) + '%';

        // 1: Pressure
        const pressureVal = values[configs[1].id]?.value ?? 0;
        nodes.pressureText.textContent = pressureVal.toFixed(2);

        // 2: Flow
        const flowVal = values[configs[2].id]?.value ?? 0;
        nodes.flowText.textContent = flowVal.toFixed(1);

        // 3: Voltage
        const volVal = values[configs[3].id]?.value ?? 0;
        nodes.voltageText.textContent = volVal.toFixed(1);
        nodes.voltageBar.style.width = Math.min((volVal / 250) * 100, 100) + '%'; // assuming 250V is max for scaling

        // 4: Current
        const curVal = values[configs[4].id]?.value ?? 0;
        nodes.currentText.textContent = curVal.toFixed(2);
        nodes.currentBar.style.width = Math.min((curVal / 50) * 100, 100) + '%'; // assuming 50A is max for scaling

        // 5: Energy
        const energyVal = values[configs[5].id]?.value ?? 0;
        nodes.energyText.textContent = energyVal.toFixed(1);

        // 6: Pump Status (0 or 1)
        const pumpVal = values[configs[6].id]?.value ?? 0;
        if(currentPumpStatus !== pumpVal) {
            currentPumpStatus = pumpVal;
            if(pumpVal === 1) {
                nodes.pumpGraphic.className = 'pump-wrapper is-on';
                nodes.statusDot.className = 'status-dot on';
                nodes.statusText.textContent = 'Trạng thái bơm: ĐANG CHẠY';
                nodes.statusText.className = 'status-text green-text';
            } else {
                nodes.pumpGraphic.className = 'pump-wrapper is-off';
                nodes.statusDot.className = 'status-dot off';
                nodes.statusText.textContent = 'Trạng thái bơm: ĐÃ DỪNG';
                nodes.statusText.className = 'status-text red-text';
            }
        }
    }
});

// Event Listeners for Actions
nodes.btnPumpOn.addEventListener('click', () => {
    if(actions.length > 0 && actions[0]?.action) {
        eraWidget.triggerAction(actions[0].action, null);
    } else {
        console.warn('Action ON not configured');
    }
});

nodes.btnPumpOff.addEventListener('click', () => {
    if(actions.length > 1 && actions[1]?.action) {
        eraWidget.triggerAction(actions[1].action, null);
    } else if (actions.length === 1 && actions[0]?.action) {
        // If they only mapped 1 toggle action
        eraWidget.triggerAction(actions[0].action, null);
    } else {
        console.warn('Action OFF not configured');
    }
});
