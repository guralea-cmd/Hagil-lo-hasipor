# הגדרת Firebase לאתר "הגיל הוא לא הסיפור"

האתר משתמש ב-Firebase לרישום לסדנה, לקליטת סיפורי קהילה (כולל וידאו) ולפאנל ניהול לאישור תכנים. כל זה עובד בלי שרת משלך - Firebase הוא ה-backend.

## שלב 1: יצירת פרויקט

1. גשו ל-https://console.firebase.google.com/ והתחברו עם חשבון Google.
2. לחצו "Add project" ותנו שם, למשל `hagil-lo-hasipor`.
3. אפשר לדלג על Google Analytics (לא נדרש).

## שלב 2: הפעלת Firestore (מסד הנתונים)

1. בתפריט הצד: Build → Firestore Database → Create database.
2. בחרו "Start in production mode" (נשתמש בכללי האבטחה בקובץ `firestore.rules`).
3. בחרו region קרוב (למשל `europe-west1`).
4. בלשונית "Rules", הדביקו את התוכן של [firestore.rules](firestore.rules) מהפרויקט הזה ופרסמו (Publish).

## שלב 3: הפעלת Storage (אחסון וידאו)

1. Build → Storage → Get started.
2. אשרו את ה-bucket המוצע.
3. בלשונית "Rules", הדביקו את התוכן של [storage.rules](storage.rules) ופרסמו.

## שלב 4: הפעלת Authentication (כניסת ניהול)

1. Build → Authentication → Get started.
2. בלשונית Sign-in method, הפעילו "Email/Password".
3. בלשונית Users, לחצו "Add user" וצרו משתמש ניהול - זה האימייל/סיסמה שישמשו אתכם לכניסה ל-`admin/login.html`.

## שלב 5: חיבור האתר לפרויקט

1. במסך הראשי של הפרויקט, לחצו על סמל ה-Web (</>) כדי להוסיף אפליקציית Web.
2. תנו שם (למשל `hagil-website`), אין צורך ב-Firebase Hosting.
3. תקבלו אובייקט `firebaseConfig` עם מפתחות. העתיקו את הערכים לקובץ [js/firebase-config.js](js/firebase-config.js) במקום הטקסטים `REPLACE_WITH_...`.

## שלב 6: בדיקה

1. פתחו את `register.html` בדפדפן ושלחו רישום בדיקה.
2. ב-Firestore Console תחת `registrations` אמורה להופיע רשומה חדשה.
3. פתחו את `submit-story.html`, מלאו טופס עם קובץ וידאו קטן, ושלחו.
4. ב-Firestore תחת `stories` תופיע רשומה עם `status: pending`, ובStorage תחת `stories/` יופיע קובץ הוידאו.
5. פתחו את `admin/login.html`, התחברו עם משתמש הניהול שיצרתם, ולחצו "אשר" על הסיפור.
6. רעננו את `stories.html` - הסיפור המאושר אמור להופיע בעמוד הציבורי.

## הערות חשובות

- **מגבלת קובץ**: הטופס חוסם קבצים מעל 100MB. ניתן לשנות ב-[js/submit-story.js](js/submit-story.js) ובכלל האבטחה ב-[storage.rules](storage.rules) (יש לשנות בשני המקומות).
- **תוכנית חינמית (Spark)**: ל-Firebase יש תוכנית חינמית נדיבה (Firestore, Storage, Auth) שמספיקה להיקף סביר של סדנה. אם תרצו לעבור לגביית תשלום בעתיד, תצטרכו להוסיף ספק סליקה (Stripe / Cardcom / PayPlus) - זה שינוי נפרד מה-backend הנוכחי.
- **פריסה (hosting)**: האתר עצמו עדיין קבצים סטטיים (HTML/CSS/JS). אפשר להעלות אותו ל-GitHub Pages, Netlify, Vercel או Firebase Hosting - הוא יתחבר ל-Firebase מכל מקום, כי כל החיבור קורה בצד הדפדפן.
- **אבטחה**: כללי ה-Rules כתובים כך שכל אחד יכול *לשלוח* רישום/סיפור, אבל רק משתמש מחובר (אתם, בפאנל הניהול) יכול *לקרוא* רישומים, לאשר/לדחות סיפורים, או למחוק קבצים.
