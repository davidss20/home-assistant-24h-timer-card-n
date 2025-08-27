# 🎯 התקנת כרטיס Timer 24H

## מצב נוכחי ✅
- ✅ האינטגרציה מותקנת ועובדת
- ❌ הכרטיס חסר בדשבורד

## שלב 1: העתקת קבצי הכרטיס

### אופציה A: העתקה ידנית
1. **צור תיקייה חדשה:**
   ```
   config/www/timer-24h-card/
   ```

2. **העתק את הקבצים:**
   - `www/timer-24h-card.js` → `config/www/timer-24h-card/timer-24h-card.js`
   - `www/timer-24h-card-editor.js` → `config/www/timer-24h-card/timer-24h-card-editor.js`

### אופציה B: HACS Frontend (מומלץ)
1. **פתח HACS** → **Frontend** 
2. **לחץ על ⋮** → **Custom repositories**
3. **הוסף את הקישור:** `https://github.com/davidss20/home-assistant-24h-timer-card-n`
4. **קטגוריה:** `Lovelace`
5. **לחץ Add** → **Install**

## שלב 2: הוספת המשאב לLovelace

### דרך ה-UI (קל יותר):
1. **Settings** → **Dashboards** → **More options (⋮)** → **Resources**
2. **לחץ Add Resource**
3. **URL:** `/local/timer-24h-card/timer-24h-card.js`
4. **Resource type:** `JavaScript Module`
5. **לחץ Create**

### דרך YAML:
הוסף לקובץ `configuration.yaml`:
```yaml
lovelace:
  mode: yaml
  resources:
    - url: /local/timer-24h-card/timer-24h-card.js
      type: module
```

## שלב 3: הוספת הכרטיס לדשבורד

### דרך ה-UI:
1. **עבור לדשבורד** → **לחץ Edit** 
2. **לחץ Add Card**
3. **חפש:** `Timer 24H Card`
4. **בחר את הכרטיס** → **Configure**
5. **בחר Entity** (sensor.timer_24h_[schedule_id])
6. **לחץ Save**

### דרך YAML:
```yaml
type: custom:timer-24h-card
title: "Timer 24H"
entity: sensor.timer_24h_main  # החלף בשם הסנסור שלך
show_slots: true
compact: false
```

## שלב 4: איתור הסנסור הנכון

אם אתה לא יודע את שם הסנסור:
1. **Developer Tools** → **States**
2. **חפש:** `sensor.timer_24h_`
3. **תראה את כל הסנסורים** של Timer 24H
4. **השתמש בשם הסנסור** בהגדרת הכרטיס

## 🔧 פתרון בעיות

### אם הכרטיס לא מופיע:
1. **נקה cache של הדפדפן** (Ctrl + F5)
2. **בדוק שהמשאב נוסף** בSettings → Resources
3. **בדוק שהקבצים במקום הנכון** (/config/www/...)

### אם אין סנסורים:
1. **ודא שהאינטגרציה מותקנת** (Settings → Integrations)
2. **צור לוח זמנים ראשון:**
   ```yaml
   # Services → timer24h.set_schedule
   schedule_id: "main"
   target_entity_id: "light.living_room" 
   slots: [true, true, false, false, ...] # 48 ערכים
   ```

## 🎉 סיימת!
הכרטיס אמור להופיע עכשיו בדשבורד עם כל הפונקציונליות!
