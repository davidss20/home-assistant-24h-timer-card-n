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

    const entityId = this._config.entity || this._findTimerEntity();
    const entity = this._hass.states[entityId];
    
    if (!entity) {
      this.shadowRoot.innerHTML = `
        <ha-card>
          <div class="card-content">
            <p style="color: var(--error-color);">Timer 24H entity not found!</p>
            <p>Available Timer 24H entities:</p>
            <ul>
              ${Object.keys(this._hass.states)
                .filter(id => id.startsWith('sensor.timer_24h_'))
                .map(id => `<li><code>${id}</code></li>`)
                .join('')}
            </ul>
            ${Object.keys(this._hass.states).filter(id => id.startsWith('sensor.timer_24h_')).length === 0 ? 
              '<p style="color: var(--warning-color);">No schedules found. Create one first using the timer24h.set_schedule service.</p>' : ''}
          </div>
        </ha-card>
      `;
      return;
    }

    const attributes = entity.attributes || {};
    const scheduleId = attributes.schedule_id || 'Unknown';
    const targetEntity = attributes.target_entity_id || 'Unknown';
    const enabled = attributes.enabled ?? false;
    const currentSlot = attributes.current_slot ?? 0;
    const isActive = attributes.is_active ?? false;
    const lastEvaluation = attributes.last_condition_evaluation || 'No conditions';
    const slots = attributes.slots || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
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
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85em;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-badge.enabled {
          background-color: var(--success-color);
          color: white;
        }
        .status-badge.disabled {
          background-color: var(--error-color);
          color: white;
        }
        .status-badge.active {
          background-color: var(--warning-color);
          color: white;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .info-item {
          background: var(--card-background-color);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--divider-color);
        }
        .info-label {
          font-size: 0.8em;
          color: var(--secondary-text-color);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          font-weight: 500;
          color: var(--primary-text-color);
          word-break: break-all;
        }
        .slots-container {
          margin-top: 16px;
        }
        .slots-title {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          margin-bottom: 8px;
          font-weight: 500;
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
          padding: 2px;
        }
        .slots-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 2px;
          margin-bottom: 8px;
        }
        .slot {
          aspect-ratio: 1;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6em;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--card-background-color);
        }
        .slot.active {
          background-color: var(--primary-color);
          color: var(--text-primary-color);
          border-color: var(--primary-color);
        }
        .slot.current {
          border: 2px solid var(--accent-color);
          box-shadow: 0 0 8px rgba(var(--accent-color-rgb), 0.3);
        }
        .slot:hover {
          transform: scale(1.1);
          z-index: 1;
        }
        .actions {
          margin-top: 16px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .action-button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9em;
          transition: all 0.2s ease;
          flex: 1;
          min-width: 120px;
        }
        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .enable-btn {
          background-color: var(--success-color);
          color: white;
        }
        .disable-btn {
          background-color: var(--error-color);
          color: white;
        }
        .reconcile-btn {
          background-color: var(--info-color);
          color: white;
        }
        .evaluation-text {
          font-size: 0.85em;
          color: var(--secondary-text-color);
          font-style: italic;
        }
      </style>
      
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">${this._config.title || 'Timer 24H Schedule'}</div>
            <div class="status-badge ${enabled ? (isActive ? 'active' : 'enabled') : 'disabled'}">
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
              <div class="info-value">${currentSlot} (${this._formatSlotTime(currentSlot)})</div>
            </div>
            <div class="info-item">
              <div class="info-label">Entity State</div>
              <div class="info-value">${entity.state}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-label">Last Evaluation</div>
            <div class="info-value evaluation-text">${lastEvaluation}</div>
          </div>
          
          ${this._config.show_slots !== false ? `
          <div class="slots-container">
            <div class="slots-title">24-Hour Schedule (${slots.filter(Boolean).length}/48 active slots)</div>
            <div class="time-labels">
              ${Array.from({length: 12}, (_, i) => `<div class="time-label">${i * 2}:00</div>`).join('')}
            </div>
            <div class="slots-grid">
              ${this._generateSlots(slots, currentSlot)}
            </div>
          </div>
          ` : ''}
          
          <div class="actions">
            <button class="action-button ${enabled ? 'disable-btn' : 'enable-btn'}" 
                    @click="${() => this._toggleSchedule()}">
              ${enabled ? 'Disable Schedule' : 'Enable Schedule'}
            </button>
            <button class="action-button reconcile-btn" 
                    @click="${() => this._reconcileSchedule()}">
              Reconcile Now
            </button>
          </div>
        </div>
      </ha-card>
    `;

    // Add event listeners
    this.shadowRoot.querySelectorAll('[\\@click]').forEach(button => {
      const clickHandler = button.getAttribute('@click');
      if (clickHandler) {
        button.addEventListener('click', () => {
          if (clickHandler.includes('_toggleSchedule')) this._toggleSchedule();
          if (clickHandler.includes('_reconcileSchedule')) this._reconcileSchedule();
        });
      }
    });
  }

  _findTimerEntity() {
    if (!this._hass) return 'sensor.timer_24h_main';
    
    const timerEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.timer_24h_'));
    
    return timerEntities.length > 0 ? timerEntities[0] : 'sensor.timer_24h_main';
  }

  _formatSlotTime(slot) {
    const hour = Math.floor(slot / 2);
    const minute = (slot % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  _generateSlots(slots, currentSlot) {
    return Array.from({length: 48}, (_, i) => {
      const isActive = slots[i] || false;
      const isCurrent = i === currentSlot;
      const classes = ['slot'];
      if (isActive) classes.push('active');
      if (isCurrent) classes.push('current');
      
      const hour = Math.floor(i / 2);
      const showHour = i % 4 === 0 ? hour : '';
      
      return `<div class="${classes.join(' ')}" title="Slot ${i} (${this._formatSlotTime(i)})">${showHour}</div>`;
    }).join('');
  }

  _toggleSchedule() {
    const entityId = this._config.entity || this._findTimerEntity();
    const entity = this._hass.states[entityId];
    const scheduleId = entity?.attributes?.schedule_id;
    const enabled = entity?.attributes?.enabled || false;
    
    if (!scheduleId) {
      alert('No schedule ID found');
      return;
    }
    
    this._hass.callService('timer24h', enabled ? 'disable' : 'enable', {
      schedule_id: scheduleId
    });
  }

  _reconcileSchedule() {
    const entityId = this._config.entity || this._findTimerEntity();
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
      title: 'Timer 24H Schedule',
      show_slots: true
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
  description: 'A card for displaying and controlling Timer 24H schedules',
  preview: true,
  documentationURL: 'https://github.com/davidss20/home-assistant-24h-timer-card-n'
});

console.info(
  '%c  Timer 24H Card  %c  v1.0.0  ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);
