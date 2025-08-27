class Timer24HCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  setConfig(config) {
    this._config = config;
  }

  render() {
    if (!this._hass || !this._config) return;

    const entityId = this._config.entity || 'sensor.timer_24h_main';
    const entity = this._hass.states[entityId];
    
    if (!entity) {
      this.shadowRoot.innerHTML = `
        <ha-card>
          <div class="card-content">
            <p>Entity not found: ${entityId}</p>
            <p>Available entities:</p>
            <ul>
              ${Object.keys(this._hass.states)
                .filter(id => id.startsWith('sensor.timer_24h_'))
                .map(id => `<li>${id}</li>`)
                .join('')}
            </ul>
          </div>
        </ha-card>
      `;
      return;
    }

    const attributes = entity.attributes || {};
    const scheduleId = attributes.schedule_id || 'Unknown';
    const targetEntity = attributes.target_entity_id || 'Unknown';
    const enabled = attributes.enabled || false;
    const currentSlot = attributes.current_slot || 0;
    const isActive = attributes.is_active || false;
    const lastEvaluation = attributes.last_condition_evaluation || 'No conditions';

    this.shadowRoot.innerHTML = `
      <style>
        .card-content {
          padding: 16px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .title {
          font-size: 1.2em;
          font-weight: bold;
        }
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
          font-weight: bold;
        }
        .status.enabled {
          background-color: #4caf50;
          color: white;
        }
        .status.disabled {
          background-color: #f44336;
          color: white;
        }
        .status.active {
          background-color: #ff9800;
          color: white;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        .info-item {
          background: var(--primary-background-color);
          padding: 8px;
          border-radius: 4px;
          border: 1px solid var(--divider-color);
        }
        .info-label {
          font-size: 0.8em;
          color: var(--secondary-text-color);
          margin-bottom: 4px;
        }
        .info-value {
          font-weight: bold;
        }
        .slots-container {
          margin-top: 16px;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 2px;
          margin-top: 8px;
        }
        .slot {
          width: 20px;
          height: 20px;
          border: 1px solid var(--divider-color);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7em;
          cursor: pointer;
        }
        .slot.active {
          background-color: var(--primary-color);
          color: white;
        }
        .slot.current {
          border: 2px solid var(--accent-color);
          box-shadow: 0 0 4px var(--accent-color);
        }
        .time-labels {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 2px;
          margin-bottom: 4px;
          font-size: 0.7em;
          color: var(--secondary-text-color);
        }
        .time-label {
          text-align: center;
        }
        .actions {
          margin-top: 16px;
          display: flex;
          gap: 8px;
        }
        .action-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .enable-btn {
          background-color: #4caf50;
          color: white;
        }
        .disable-btn {
          background-color: #f44336;
          color: white;
        }
        .reconcile-btn {
          background-color: #2196f3;
          color: white;
        }
      </style>
      
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">${this._config.title || 'Timer 24H'}</div>
            <div class="status ${enabled ? (isActive ? 'active' : 'enabled') : 'disabled'}">
              ${enabled ? (isActive ? 'Active' : 'Enabled') : 'Disabled'}
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Schedule ID</div>
              <div class="info-value">${scheduleId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Target Entity</div>
              <div class="info-value">${targetEntity}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Current Slot</div>
              <div class="info-value">${currentSlot} (${Math.floor(currentSlot / 2).toString().padStart(2, '0')}:${(currentSlot % 2) * 30 === 0 ? '00' : '30'})</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value">${entity.state}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-label">Last Evaluation</div>
            <div class="info-value">${lastEvaluation}</div>
          </div>
          
          <div class="slots-container">
            <div class="info-label">24-Hour Schedule (48 slots)</div>
            <div class="time-labels">
              ${Array.from({length: 12}, (_, i) => `<div class="time-label">${i * 2}:00</div>`).join('')}
            </div>
            <div class="slots-grid">
              ${this.generateSlots(attributes.slots || [], currentSlot)}
            </div>
          </div>
          
          <div class="actions">
            <button class="action-button ${enabled ? 'disable-btn' : 'enable-btn'}" 
                    onclick="this.getRootNode().host.toggleSchedule()">
              ${enabled ? 'Disable' : 'Enable'}
            </button>
            <button class="action-button reconcile-btn" 
                    onclick="this.getRootNode().host.reconcileSchedule()">
              Reconcile Now
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }

  generateSlots(slots, currentSlot) {
    return Array.from({length: 48}, (_, i) => {
      const isActive = slots[i] || false;
      const isCurrent = i === currentSlot;
      const classes = ['slot'];
      if (isActive) classes.push('active');
      if (isCurrent) classes.push('current');
      
      return `<div class="${classes.join(' ')}" title="Slot ${i} (${Math.floor(i / 2).toString().padStart(2, '0')}:${(i % 2) * 30 === 0 ? '00' : '30'})">${i % 4 === 0 ? Math.floor(i / 2) : ''}</div>`;
    }).join('');
  }

  toggleSchedule() {
    const entityId = this._config.entity || 'sensor.timer_24h_main';
    const entity = this._hass.states[entityId];
    const scheduleId = entity?.attributes?.schedule_id;
    const enabled = entity?.attributes?.enabled || false;
    
    if (!scheduleId) return;
    
    this._hass.callService('timer24h', enabled ? 'disable' : 'enable', {
      schedule_id: scheduleId
    });
  }

  reconcileSchedule() {
    const entityId = this._config.entity || 'sensor.timer_24h_main';
    const entity = this._hass.states[entityId];
    const scheduleId = entity?.attributes?.schedule_id;
    
    if (!scheduleId) {
      this._hass.callService('timer24h', 'reconcile', {});
    } else {
      this._hass.callService('timer24h', 'reconcile', {
        schedule_id: scheduleId
      });
    }
  }

  static getConfigElement() {
    return document.createElement('timer-24h-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:timer-24h-card',
      title: 'Timer 24H',
      entity: 'sensor.timer_24h_main'
    };
  }
}

// Register the card
customElements.define('timer-24h-card', Timer24HCard);

// Add to custom cards list
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'timer-24h-card',
  name: 'Timer 24H Card',
  description: 'A card for Timer 24H integration',
  preview: true
});

console.info(
  '%c  Timer 24H Card  %c  v1.0.0  ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);
