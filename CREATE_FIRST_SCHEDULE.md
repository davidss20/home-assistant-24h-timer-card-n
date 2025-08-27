# 🚀 יצירת לוח הזמנים הראשון

## מדוע אתה לא רואה כרטיס?
כנראה שעדיין לא יצרת לוח זמנים, אז אין סנסורים להציג.

## צעדים מהירים:

### שלב 1: יצירת לוח זמנים ראשון
1. **עבור ל:** **Settings** → **Developer Tools** → **Services**
2. **בחר Service:** `timer24h.set_schedule`
3. **הדבק את הקוד:**

```yaml
schedule_id: "main_lights"
target_entity_id: "light.living_room"  # החלף בישות שלך
enabled: true
slots: [
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, true,  true,  true,  true,
  true,  true,  true,  true,  true,  true,  false, false, false, false, false, false
]
```

4. **לחץ Call Service**

### הסבר על הסלוטים:
- **48 סלוטים** = 24 שעות × 2 (כל חצי שעה)
- **true** = פעיל באותו זמן
- **false** = לא פעיל
- **הדוגמא למעלה:** פעיל בין 16:00-21:00

### שלב 2: בדיקה שנוצר סנסור
1. **Developer Tools** → **States**
2. **חפש:** `sensor.timer_24h_main_lights`
3. **אמור להופיע!**

### שלב 3: הוספת הכרטיס
עכשיו תוכל להוסיף את הכרטיס כמו שמתואר ב-`CARD_INSTALLATION.md`

## דוגמאות נוספות:

### שעון מעורר (06:00-07:00):
```yaml
schedule_id: "morning_alarm"
target_entity_id: "media_player.bedroom"
enabled: true
slots: [
  false, false, false, false, false, false, false, false, false, false, false, false,
  true,  true,  true,  true,  false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false
]
```

### השקיה (05:00 ו-18:00):
```yaml
schedule_id: "garden_watering" 
target_entity_id: "switch.garden_sprinkler"
enabled: true
slots: [
  false, false, false, false, false, false, false, false, false, false, true,  false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  false, false, false, false, false, false, false, false, false, false, false, false,
  true,  false, false, false, false, false, false, false, false, false, false, false
]
```

## 🎯 טיפ מהיר:
אם אתה רוצה ליצור לוח זמנים בקלות, השתמש בכלי online:
1. חשב איזה שעות אתה רוצה שיהיה פעיל
2. המר לסלוטים (כל שעה = 2 סלוטים)
3. הדבק בקוד למעלה

**אחרי יצירת לוח זמנים ראשון, הכרטיס יופיע!** 🎉
