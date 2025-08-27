# 📋 העתקה מהירה עם File Editor

## אם יש לך File Editor Add-on (הכי קל):

### שלב 1: צור את הקבצים
1. **File Editor** → **פתח את File Editor**
2. **צור קובץ חדש:** `/config/www/timer-24h-card/timer-24h-card.js`

### שלב 2: העתק את הקוד
**העתק את כל הטקסט הזה לקובץ `timer-24h-card.js`:**

```javascript
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
        .card-content { padding: 16px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .title { font-size: 1.2em; font-weight: bold; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; font-weight: bold; }
        .status.enabled { background-color: #4caf50; color: white; }
        .status.disabled { background-color: #f44336; color: white; }
        .status.active { background-color: #ff9800; color: white; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .info-item { background: var(--primary-background-color); padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); }
        .info-label { font-size: 0.8em; color: var(--secondary-text-color); margin-bottom: 4px; }
        .info-value { font-weight: bold; }
        .actions { margin-top: 16px; display: flex; gap: 8px; }
        .action-button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .enable-btn { background-color: #4caf50; color: white; }
        .disable-btn { background-color: #f44336; color: white; }
        .reconcile-btn { background-color: #2196f3; color: white; }
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

  static getStubConfig() {
    return {
      type: 'custom:timer-24h-card',
      title: 'Timer 24H',
      entity: 'sensor.timer_24h_main'
    };
  }
}

customElements.define('timer-24h-card', Timer24HCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'timer-24h-card',
  name: 'Timer 24H Card',
  description: 'A card for Timer 24H integration'
});

console.info('%c Timer 24H Card %c v1.0.0 ', 'color: orange; font-weight: bold; background: black', 'color: white; font-weight: bold; background: dimgray');
```

### שלב 3: שמור הקובץ
**Ctrl+S** או לחץ **Save**

## אחרי זה:
1. **הוסף משאב:** Settings → Dashboards → Resources → `/local/timer-24h-card/timer-24h-card.js`
2. **צור לוח זמנים** (עם השירות timer24h.set_schedule)
3. **הוסף כרטיס** לדשבורד

**זה יעבוד!** 🎉
