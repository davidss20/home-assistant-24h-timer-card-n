# הוראות תיקון שגיאות HACS

## מצב נוכחי ✅
- ✅ כל שגיאות הלינטינג תוקנו (ruff)
- ✅ פורמט הקוד תוקן (ruff format)  
- ✅ כל שגיאות mypy type annotations תוקנו (17 שגיאות)
- ✅ קובץ hacs.json עודכן, הועבר לשורש, ו**הוסרו שדות לא מורשים**
- ✅ אזהרות סודות פוטנציאליים נפתרו

## 🔍 הבעיות שמצאנו ותיקנו:

### 1. מיקום שגוי של hacs.json:
- ❌ **מיקום קודם**: `custom_components/timer24h/hacs.json`
- ✅ **מיקום נכון**: `hacs.json` (בשורש הפרויקט)

### 2. שדות לא מורשים ב-hacs.json:
- ❌ הסרנו: `domains`, `iot_class`, `hacs`, `homeassistant` 
- ✅ השארנו רק: `name`, `content_in_root`, `render_readme`

השדות `domains` ו`iot_class` שייכים ל-`manifest.json`, לא ל-`hacs.json`!

## 🎯 מה אמור לעבוד עכשיו:
עם hacs.json המינימלי החדש, שגיאת `<Validation hacsjson> failed` אמורה להיפתר!

**hacs.json הנוכחי (תקין):**
```json
{
  "name": "Timer 24H Integration",
  "content_in_root": false,
  "render_readme": true
}
```

## פעולות נדרשות ב-GitHub 🔧

### 1. הוספת תיאור למאגר (Repository Description)
1. עבור ל: https://github.com/davidss20/home-assistant-24h-timer-card-n
2. לחץ על **Settings** (הגדרות)
3. בצד ימין, תחת **About**, לחץ על ⚙️ (גלגל שיניים)
4. הוסף תיאור:
```
Professional-grade 24-hour scheduling integration for Home Assistant with server-side automation, condition-based control, and beautiful visual interface.
```

### 2. הוספת Topics (תגיות)
באותו מקום תחת **About**, הוסף את התגיות הבאות (הקלד אחת אחרי השנייה):
- `home-assistant`
- `hacs`
- `custom-integration`
- `timer`
- `scheduler`
- `automation`
- `24-hour`
- `smart-home`
- `lovelace`
- `websocket`

### 3. טיפול ב-Brands Repository (אופציונלי)
שגיאת ה-brands היא לא חובה עבור פעולה רגילה. אם אתה רוצה לטפל בה:

1. **Fork** את המאגר: https://github.com/home-assistant/brands
2. צור תיקייה: `custom_integrations/timer24h/`
3. העתק את `icon.png` מהמאגר שלך לשם (בגודל 512x512)
4. צור **Pull Request**

**חלופה**: אם לא רוצה לעסוק בזה, אפשר להוסיף חזרה את השורה:
```json
"skip": ["brands"]
```
לקובץ `custom_components/timer24h/hacs.json`

## בדיקה סופית ✔️
לאחר ביצוע השינויים ב-GitHub:
1. המתן כ-5 דקות לעדכון של GitHub
2. נסה שוב את הwalidation של HACS
3. כל השגיאות אמורות להיפתר!

---
**הערה**: השגיאות החשובות ביותר (לינטינג ו-hacs.json) כבר תוקנו. השגיאות הנותרות (description, topics, brands) הן הגדרות של GitHub שצריך לעדכן ידנית.
