class Timer24HCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = { ...config };
    this.render();
  }

  render() {
    if (!this._hass) return;

    // Get all timer24h sensors
    const timerEntities = Object.keys(this._hass.states)
      .filter(entityId => entityId.startsWith('sensor.timer_24h_'))
      .sort();

    this.shadowRoot.innerHTML = `
      <style>
        .card-config {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .config-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .config-row label {
          min-width: 120px;
          font-weight: bold;
        }
        .config-row input,
        .config-row select {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--primary-background-color);
          color: var(--primary-text-color);
        }
        .config-row input:focus,
        .config-row select:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        .help-text {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          font-style: italic;
        }
      </style>
      
      <div class="card-config">
        <div class="config-row">
          <label for="title">Title:</label>
          <input 
            type="text" 
            id="title" 
            value="${this._config.title || 'Timer 24H'}" 
            placeholder="Timer 24H"
            @change=${this._valueChanged}
          />
        </div>
        
        <div class="config-row">
          <label for="entity">Entity:</label>
          <select id="entity" @change=${this._valueChanged}>
            <option value="">Select Timer Entity</option>
            ${timerEntities.map(entityId => `
              <option value="${entityId}" ${this._config.entity === entityId ? 'selected' : ''}>
                ${entityId}
              </option>
            `).join('')}
          </select>
        </div>
        <div class="help-text">
          Select the Timer 24H sensor entity to display. If no entities appear, make sure you have created a schedule first.
        </div>
        
        <div class="config-row">
          <label for="show_slots">Show Time Slots:</label>
          <input 
            type="checkbox" 
            id="show_slots" 
            ${this._config.show_slots !== false ? 'checked' : ''}
            @change=${this._valueChanged}
          />
        </div>
        <div class="help-text">
          Display the 48 half-hour time slots visualization.
        </div>
        
        <div class="config-row">
          <label for="compact">Compact Mode:</label>
          <input 
            type="checkbox" 
            id="compact" 
            ${this._config.compact === true ? 'checked' : ''}
            @change=${this._valueChanged}
          />
        </div>
        <div class="help-text">
          Use a more compact layout for smaller cards.
        </div>
      </div>
    `;

    // Add event listeners
    this.shadowRoot.querySelectorAll('input, select').forEach(element => {
      element.addEventListener('change', this._valueChanged.bind(this));
    });
  }

  _valueChanged(event) {
    if (!this._config || !this._hass) return;

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    
    this._config = {
      ...this._config,
      [target.id]: value
    };

    // Fire config changed event
    const event_detail = {
      config: this._config
    };
    
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: event_detail,
      bubbles: true,
      composed: true
    }));
  }
}

// Register the editor
customElements.define('timer-24h-card-editor', Timer24HCardEditor);
