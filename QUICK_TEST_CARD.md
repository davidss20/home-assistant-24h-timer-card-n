# 🚀 כרטיס זמני לבדיקה

## אם אתה רוצה לבדוק עכשיו בלי התקנה מחדש:

### שלב 1: צור קובץ
ב-File Editor או בתיקיית `/config/www/` צור קובץ:
**`timer-24h-card.js`**

### שלב 2: העתק את הקוד הזה:
```javascript
class Timer24HCard extends HTMLElement {
  set hass(hass) { this._hass = hass; this.render(); }
  setConfig(config) { this._config = config; }
  
  render() {
    if (!this._hass || !this._config) return;
    
    const entities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.timer_24h_'));
    
    const entityId = this._config.entity || entities[0] || 'sensor.timer_24h_demo';
    const entity = this._hass.states[entityId];
    
    if (!entity) {
      this.innerHTML = `
        <ha-card>
          <div style="padding: 16px;">
            <h3>Timer 24H</h3>
            <p style="color: orange;">No Timer 24H entities found!</p>
            <p>Create a schedule first:</p>
            <code>timer24h.set_schedule</code>
            <p>Available entities: ${entities.length}</p>
            ${entities.map(id => `<div>${id}</div>`).join('')}
          </div>
        </ha-card>
      `;
      return;
    }
    
    const attr = entity.attributes || {};
    this.innerHTML = `
      <ha-card>
        <div style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <h3>${this._config.title || 'Timer 24H'}</h3>
            <span style="background: ${attr.enabled ? '#4caf50' : '#f44336'}; color: white; padding: 4px 8px; border-radius: 4px;">
              ${attr.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div style="background: #f5f5f5; padding: 8px; border-radius: 4px;">
              <div style="font-size: 0.8em; color: #666;">Schedule ID</div>
              <div><strong>${attr.schedule_id || 'Unknown'}</strong></div>
            </div>
            <div style="background: #f5f5f5; padding: 8px; border-radius: 4px;">
              <div style="font-size: 0.8em; color: #666;">Target Entity</div>
              <div><strong>${attr.target_entity_id || 'Unknown'}</strong></div>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 8px; border-radius: 4px; margin-bottom: 16px;">
            <div style="font-size: 0.8em; color: #666;">Status</div>
            <div><strong>${entity.state}</strong></div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="this.parentElement.parentElement.parentElement.parentElement.toggleSchedule()" 
                    style="flex: 1; padding: 10px; border: none; border-radius: 4px; background: ${attr.enabled ? '#f44336' : '#4caf50'}; color: white; cursor: pointer;">
              ${attr.enabled ? 'Disable' : 'Enable'}
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.parentElement.reconcile()"
                    style="flex: 1; padding: 10px; border: none; border-radius: 4px; background: #2196f3; color: white; cursor: pointer;">
              Reconcile
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }
  
  toggleSchedule() {
    const entityId = this._config.entity || Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.timer_24h_'))[0];
    const entity = this._hass.states[entityId];
    const scheduleId = entity?.attributes?.schedule_id;
    const enabled = entity?.attributes?.enabled;
    
    if (scheduleId) {
      this._hass.callService('timer24h', enabled ? 'disable' : 'enable', {
        schedule_id: scheduleId
      });
    }
  }
  
  reconcile() {
    this._hass.callService('timer24h', 'reconcile', {});
  }
  
  static getStubConfig() {
    return { type: 'custom:timer-24h-card', title: 'Timer 24H' };
  }
}

customElements.define('timer-24h-card', Timer24HCard);
console.log('Timer 24H Card loaded');
```

### שלב 3: הוסף משאב
1. **Settings** → **Dashboards** → **Resources**
2. **Add Resource**
3. **URL:** `/local/timer-24h-card.js`
4. **Type:** JavaScript Module
5. **Create**

### שלב 4: צור לוח זמנים
1. **Developer Tools** → **Services** → **timer24h.set_schedule**
2. **Service data:**
```yaml
schedule_id: "test"
target_entity_id: "light.living_room"
enabled: true
slots: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false]
```

### שלב 5: הוסף כרטיס
1. **Dashboard** → **Add Card** → **Timer 24H**

## זה יעבד מיד! 🎉
