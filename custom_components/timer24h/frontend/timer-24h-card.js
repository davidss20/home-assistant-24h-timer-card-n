// Timer 24H Card for Home Assistant - Integration Built-in
// Version 2.1.1 - Beautiful Circular UI

// i18n translations & helpers
const TIMER24H_I18N = {
  en: {
    title_default: "24 Hour Timer",
    status_on: "Active", 
    status_off: "Inactive",
    sync_cloud: "Synced",
    sync_local: "Local",
  },
  he: {
    title_default: "טיימר 24 שעות",
    status_on: "מופעל",
    status_off: "מושבת", 
    sync_cloud: "🌐 מסונכרן",
    sync_local: "💾 מקומי",
  },
  es: {
    title_default: "Temporizador 24h",
    status_on: "Activo",
    status_off: "Inactivo",
    sync_cloud: "Sincronizado", 
    sync_local: "Local",
  },
  fr: {
    title_default: "Minuteur 24h",
    status_on: "Actif",
    status_off: "Inactif",
    sync_cloud: "Synchronisé",
    sync_local: "Local",
  },
};

function pickLangFromHass(hass) {
  const cand = hass?.locale?.language || hass?.language || 
    (typeof navigator !== "undefined" && navigator.language?.slice(0, 2)) || "en";
  const key = (cand || "en").toLowerCase().slice(0, 2);
  return TIMER24H_I18N[key] ? key : "en";
}

function t(dict, key) {
  const lang = dict.__lang__ || "en";
  const pack = TIMER24H_I18N[lang] || TIMER24H_I18N.en;
  return pack[key] ?? TIMER24H_I18N.en[key] ?? key;
}

class Timer24HCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timeSlots = this.initializeTimeSlots();
    this.currentTime = new Date();
    this.isSystemActive = true;
    this.updateInterval = null;
    this.config = null;
    this._hass = null;

    // i18n state holder
    this.__i18n = { __lang__: 'en' };
  }

  static getStubConfig() {
    return {
      title: 'Timer 24H',
      show_slots: true,
      language: 'en',
    };
  }

  getCardSize() {
    return 3;
  }

  static getLayoutOptions() {
    return {
      grid_rows: 3,
      grid_columns: 3,
      grid_min_rows: 3, 
      grid_min_columns: 3
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this.config = {
      title: '24 Hour Timer',
      show_slots: true,
      language: 'en',
      entity: null,
      ...config
    };

    this.__i18n = { __lang__: this.config.language || 'en' };
    this.loadScheduleData();
  }

  set hass(hass) {
    this._hass = hass;

    if (!this.config?.language && hass) {
      this.__i18n = { __lang__: pickLangFromHass(hass) };
    }

    if (hass) {
      this.updateCurrentTime();
      this.loadScheduleData();
      this.render();
    }
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this.startTimer();
  }

  disconnectedCallback() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  initializeTimeSlots() {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push({ hour, minute: 0, isActive: false });
      slots.push({ hour, minute: 30, isActive: false });
    }
    return slots;
  }

  startTimer() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.updateCurrentTime();
      this.render();
    }, 30000); // Update every 30 seconds
  }

  updateCurrentTime() {
    this.currentTime = new Date();
  }

  loadScheduleData() {
    if (!this._hass) return;

    // Find Timer 24H entities and load their data
    const entities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.timer_24h_'));

    if (entities.length > 0) {
      const entityId = this.config.entity || entities[0];
      const entity = this._hass.states[entityId];
      
      if (entity && entity.attributes && entity.attributes.slots) {
        // Convert integration slots to our format
        const slots = entity.attributes.slots || [];
        this.timeSlots = [];
        
        for (let i = 0; i < 48; i++) {
          const hour = Math.floor(i / 2);
          const minute = (i % 2) * 30;
          this.timeSlots.push({
            hour,
            minute,
            isActive: slots[i] || false
          });
        }
      }
    }
  }

  toggleTimeSlot(hour, minute) {
    const slot = this.timeSlots.find(s => s.hour === hour && s.minute === minute);
    if (slot) {
      slot.isActive = !slot.isActive;
      this.updateIntegrationData();
      this.render();
    }
  }

  updateIntegrationData() {
    if (!this._hass) return;

    // Find the timer entity
    const entities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.timer_24h_'));

    if (entities.length > 0) {
      const entityId = this.config.entity || entities[0];
      const entity = this._hass.states[entityId];
      
      if (entity && entity.attributes && entity.attributes.schedule_id) {
        // Convert our slots to integration format
        const slots = Array.from({ length: 48 }, (_, i) => {
          const hour = Math.floor(i / 2);
          const minute = (i % 2) * 30;
          const slot = this.timeSlots.find(s => s.hour === hour && s.minute === minute);
          return slot ? slot.isActive : false;
        });

        // Update via service
        this._hass.callService('timer24h', 'set_schedule', {
          schedule_id: entity.attributes.schedule_id,
          target_entity_id: entity.attributes.target_entity_id,
          slots: slots,
          enabled: entity.attributes.enabled
        });
      }
    }
  }

  createSectorPath(hour, totalSectors, innerRadius, outerRadius, centerX, centerY) {
    const startAngle = (hour * 360 / totalSectors - 90) * (Math.PI / 180);
    const endAngle = ((hour + 1) * 360 / totalSectors - 90) * (Math.PI / 180);

    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + outerRadius * Math.cos(startAngle);
    const y2 = centerY + outerRadius * Math.sin(startAngle);
    const x3 = centerX + outerRadius * Math.cos(endAngle);
    const y3 = centerY + outerRadius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(endAngle);
    const y4 = centerY + innerRadius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
  }

  getTextPosition(hour, totalSectors, radius, centerX, centerY) {
    const angle = ((hour + 0.5) * 360 / totalSectors - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  }

  getTimeLabel(hour, minute) {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  render() {
    if (!this.config) return;

    // Ensure timeSlots is always an array
    if (!Array.isArray(this.timeSlots)) {
      this.timeSlots = this.initializeTimeSlots();
    }

    const centerX = 200;
    const centerY = 200;
    const outerRadius = 180;
    const innerRadius = 50;

    // Check if timer is currently active
    const currentHour = this.currentTime.getHours();
    const currentMinute = this.currentTime.getMinutes();
    const minute = currentMinute < 30 ? 0 : 30;

    const currentSlot = this.timeSlots.find(slot =>
      slot.hour === currentHour && slot.minute === minute
    );

    const isCurrentlyActive = (currentSlot?.isActive || false) && this.isSystemActive;

    const sectors = Array.from({ length: 24 }, (_, hour) => {
      const middleRadius = (innerRadius + outerRadius) / 2;

      // Outer half (full hour - 00)
      const outerSectorPath = this.createSectorPath(hour, 24, middleRadius, outerRadius, centerX, centerY);
      const outerTextPos = this.getTextPosition(hour, 24, (middleRadius + outerRadius) / 2, centerX, centerY);
      const outerSlot = this.timeSlots.find(s => s.hour === hour && s.minute === 0);
      const outerIsActive = outerSlot?.isActive || false;
      const outerIsCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() < 30;

      // Inner half (half hour - 30)
      const innerSectorPath = this.createSectorPath(hour, 24, innerRadius, middleRadius, centerX, centerY);
      const innerTextPos = this.getTextPosition(hour, 24, (innerRadius + middleRadius) / 2, centerX, centerY);
      const innerSlot = this.timeSlots.find(s => s.hour === hour && s.minute === 30);
      const innerIsActive = innerSlot?.isActive || false;
      const innerIsCurrent = this.currentTime.getHours() === hour && this.currentTime.getMinutes() >= 30;

      // Current hour indicator
      let currentTimeIndicator = '';
      if (outerIsCurrent || innerIsCurrent) {
        const indicatorAngle = ((hour + 0.5) * 360 / 24 - 90) * (Math.PI / 180);
        const indicatorX = centerX + (outerRadius + 10) * Math.cos(indicatorAngle);
        const indicatorY = centerY + (outerRadius + 10) * Math.sin(indicatorAngle);

        currentTimeIndicator = `
          <circle cx="${indicatorX}" cy="${indicatorY}" r="4" 
                  fill="#ff6b6b" stroke="#ffffff" stroke-width="2">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
          </circle>
        `;
      }

      return `
        <!-- Outer half (full hour) -->
        <path d="${outerSectorPath}" 
              fill="${outerIsActive ? '#10b981' : '#ffffff'}"
              stroke="${outerIsCurrent ? '#ff6b6b' : '#e5e7eb'}"
              stroke-width="${outerIsCurrent ? '3' : '1'}"
              style="cursor: pointer; transition: all 0.2s;"
              onclick="this.getRootNode().host.toggleTimeSlot(${hour}, 0)"/>
        <text x="${outerTextPos.x}" y="${outerTextPos.y + 2}" 
              text-anchor="middle" font-size="9" font-weight="bold"
              style="pointer-events: none; user-select: none;"
              fill="${outerIsActive ? '#ffffff' : '#374151'}">
          ${this.getTimeLabel(hour, 0)}
        </text>
        
        <!-- Inner half (half hour - 30) -->
        <path d="${innerSectorPath}" 
              fill="${innerIsActive ? '#10b981' : '#f8f9fa'}"
              stroke="${innerIsCurrent ? '#ff6b6b' : '#e5e7eb'}"
              stroke-width="${innerIsCurrent ? '3' : '1'}"
              style="cursor: pointer; transition: all 0.2s;"
              onclick="this.getRootNode().host.toggleTimeSlot(${hour}, 30)"/>
        <text x="${innerTextPos.x}" y="${innerTextPos.y + 1}" 
              text-anchor="middle" font-size="7" font-weight="bold"
              style="pointer-events: none; user-select: none;"
              fill="${innerIsActive ? '#ffffff' : '#6b7280'}">
          ${this.getTimeLabel(hour, 30)}
        </text>
        
        ${currentTimeIndicator}
      `;
    }).join('');

    // Hour divider lines
    const dividerLines = Array.from({ length: 24 }, (_, i) => {
      const angle = (i * 360 / 24 - 90) * (Math.PI / 180);
      const xInner = centerX + innerRadius * Math.cos(angle);
      const yInner = centerY + innerRadius * Math.sin(angle);
      const xOuter = centerX + outerRadius * Math.cos(angle);
      const yOuter = centerY + outerRadius * Math.sin(angle);
      return `<line x1="${xInner}" y1="${yInner}" x2="${xOuter}" y2="${yOuter}" stroke="#e5e7eb" stroke-width="1"/>`;
    }).join('');

    const titleText = this.config.title || t(this.__i18n, 'title_default');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--primary-font-family, sans-serif);
          position: relative;
          contain: layout style paint;
          margin: 8px;
        }
        
        .card {
          background: var(--card-background-color, #ffffff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
          padding: 0;
          overflow: hidden;
          height: calc(100% - 16px);
          min-height: 200px;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
          isolation: isolate;
          margin: 8px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          padding: 4px 8px 0 8px;
        }
        
        .title {
          font-size: 1rem;
          font-weight: bold;
          color: var(--primary-text-color, #212121);
          display: flex;
          align-items: center;
        }
        
        .status-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        
        .system-status {
          font-size: 0.7rem;
          text-align: center;
          margin: 0;
        }
         
        .system-status.active {
          color: #10b981;
        }
         
        .system-status.inactive {
          color: #f59e0b;
        }
        
        .timer-container {
          display: flex;
          justify-content: center;
          margin: 0;
          padding: 0;
          flex: 1;
          min-height: 0;
        }
        
        .timer-svg {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
      </style>
      
      <div class="card">
        <div class="header">
          <div class="title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.2em" height="1.2em" 
                 style="margin-right: 8px; vertical-align: middle;" role="img" aria-label="Home timer icon" 
                 fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="#41BDF5" stroke="#41BDF5"/>
              <path d="M11 9h2" stroke="white" stroke-width="1.6"/>
              <circle cx="12" cy="15" r="3.5" stroke="white" stroke-width="1.6" fill="none"/>
              <path d="M12 15l2-2" stroke="white" stroke-width="1.6"/>
            </svg>
            ${titleText}
          </div>
          <div class="status-container">
            <div class="system-status ${this.isSystemActive ? 'active' : 'inactive'}">
              ${this.isSystemActive ? t(this.__i18n, 'status_on') : t(this.__i18n, 'status_off')}
            </div>
          </div>
        </div>
        
        <div class="timer-container">
          <svg class="timer-svg" viewBox="0 0 400 400">
            <!-- Outer circles -->
            <circle cx="${centerX}" cy="${centerY}" r="${outerRadius}" 
                    fill="none" stroke="#e5e7eb" stroke-width="2"/>
            <circle cx="${centerX}" cy="${centerY}" r="${innerRadius}" 
                    fill="none" stroke="#e5e7eb" stroke-width="2"/>
            <!-- Middle ring separating inner/outer halves -->
            <circle cx="${centerX}" cy="${centerY}" r="${(innerRadius + outerRadius) / 2}" 
                    fill="none" stroke="#d1d5db" stroke-width="1.5"/>
            
            ${dividerLines}
            ${sectors}
            
            <!-- Center indicator -->
            <circle cx="${centerX}" cy="${centerY}" r="45" 
                    fill="${isCurrentlyActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.05)'}" 
                    stroke="${isCurrentlyActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(107, 114, 128, 0.2)'}" 
                    stroke-width="1"/>
            
            <text x="${centerX}" y="${centerY - 8}" 
                  text-anchor="middle" font-size="14" font-weight="bold"
                  fill="${isCurrentlyActive ? '#ef4444' : '#6b7280'}">
              ${isCurrentlyActive ? t(this.__i18n, 'status_on') : t(this.__i18n, 'status_off')}
            </text>
            
            <text x="${centerX}" y="${centerY + 8}" 
                  text-anchor="middle" font-size="10"
                  fill="${isCurrentlyActive ? '#ef4444' : '#6b7280'}">
              ${this.currentTime.getHours().toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}
            </text>
          </svg>
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('timer-24h-card', Timer24HCard);

// Register card for Home Assistant UI
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'timer-24h-card',
  name: 'Timer 24H Card',
  description: '24h timer with beautiful circular UI and multi-language support',
  preview: true,
  documentationURL: 'https://github.com/davidss20/home-assistant-24h-timer-card-n',
  // Grid layout support
  grid_options: {
    rows: 3,
    columns: 3,
    min_rows: 3,
    min_columns: 3
  }
});

console.info(
  '%c  TIMER-24H-CARD  %c  Version 2.1.1 - Integration Built-in  ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);