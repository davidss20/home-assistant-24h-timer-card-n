# 🚀 התקנה מהירה של הכרטיס - 5 דקות!

## 🎯 למה אתה לא רואה את הכרטיס:
1. קבצי הכרטיס לא הועתקו ל-Home Assistant
2. המשאב לא נוסף ל-Lovelace
3. עדיין אין לוח זמנים (אז אין סנסורים)

## 📋 צעדים מהירים:

### שלב 1: העתק קבצי הכרטיס
**נתיב ב-Home Assistant:** `/config/www/timer-24h-card/`

1. **צור תיקייה:**
   ```
   /config/www/timer-24h-card/
   ```

2. **העתק 2 קבצים:**
   - מ: `C:\home-assistant-24h-timer-card-n\www\timer-24h-card.js`
   - אל: `/config/www/timer-24h-card/timer-24h-card.js`
   
   - מ: `C:\home-assistant-24h-timer-card-n\www\timer-24h-card-editor.js`
   - אל: `/config/www/timer-24h-card/timer-24h-card-editor.js`

### שלב 2: הוסף משאב ב-Lovelace
1. **Settings** → **Dashboards** → **⋮ More options** → **Resources**
2. **Add Resource**
3. **URL:** `/local/timer-24h-card/timer-24h-card.js`
4. **Resource type:** `JavaScript Module`
5. **Create**

### שלב 3: צור לוח זמנים ראשון
1. **Developer Tools** → **Services**
2. **Service:** `timer24h.set_schedule`
3. **Service data:**
```yaml
schedule_id: "main_lights"
target_entity_id: "light.living_room"  # החלף בישות שלך!
enabled: true
slots: [
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, true,  true,  true,  true,
  true,  true,  true,  true,  true,  true,  false, false, false, false, false, false
]
```
4. **Call Service**

### שלב 4: בדוק שנוצר סנסור
1. **Developer Tools** → **States**
2. **חפש:** `sensor.timer_24h_main_lights`
3. **אמור להופיע!**

### שלב 5: הוסף כרטיס
1. **Dashboard** → **Edit**
2. **Add Card**
3. **חפש:** `Timer 24H`
4. **Configure:**
   - **Entity:** `sensor.timer_24h_main_lights`
   - **Title:** `Timer 24H`
5. **Save**

## 🔧 אם זה לא עובד:

### בעיית העתקה:
- **Windows/Docker:** העתק ל-`\\ip-של-home-assistant\config\www\`
- **Home Assistant OS:** השתמש ב-File Editor Add-on
- **Supervised:** נגש דרך SSH או Samba

### בעיית משאב:
- נקה cache של דפדפן (Ctrl+F5)
- בדוק שהנתיב נכון: `/local/timer-24h-card/timer-24h-card.js`

### אין סנסורים:
- בדוק שהאינטגרציה מותקנת: **Settings** → **Integrations**
- החלף `light.living_room` בישות קיימת שלך

## ⚡ דרך מהירה עם File Editor:
אם יש לך File Editor add-on:
1. צור קובץ `/config/www/timer-24h-card/timer-24h-card.js`
2. העתק את כל התוכן מהקובץ שיצרתי
3. עשה אותו דבר עם `timer-24h-card-editor.js`
