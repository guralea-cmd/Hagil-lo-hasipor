// משפך AI - צד הדף (5.10.2026). שיחה עם כפתורים ושדה טקסט, שמסתיימת בטופס שם+טלפון שנשלח לגיליון הלידים.
// עד שיש מפתח API ופריסה של Code.gs - עובד במצב הדגמה (שאלות דוגמה קבועות), כדי שאפשר יהיה לראות את המסך.
(function () {
  var BACKEND_URL = ""; // כתובת ה-web app של Code.gs אחרי הפריסה. ריק = מצב הדגמה.
  var DEMO = [
    { reply: "[טקסט זמני] שאלה ראשונה, לדוגמה: מה הכי מפריע לך היום?", options: ["[אפשרות 1]", "[אפשרות 2]", "[אפשרות 3]"], stage: "demo1", done: false, summary: "" },
    { reply: "[טקסט זמני] שאלה שנייה, פתוחה: ספרי לי במילים שלך איך את רוצה להרגיש בעוד שנה.", options: [], stage: "demo2", done: false, summary: "" },
    { reply: "[טקסט זמני] שאלה שלישית עם כפתורים: כמה זמן בשבוע את מוכנה להשקיע בזה?", options: ["[פעם בשבוע]", "[פעמיים]", "[שלוש ויותר]"], stage: "demo3", done: false, summary: "" },
    { reply: "[טקסט זמני] סיכום: ממה שסיפרת, את רוצה X ומה שעוצר אותך זה Y. הצעד הבא הוא שלאה חוזרת אלייך אישית. השאירי שם וטלפון.", options: [], stage: "done", done: true, summary: "הדגמה" }
  ];

  var messages = [];           // {role, content}
  var session = Math.random().toString(36).slice(2, 10);
  var lastSummary = "";
  var thread = document.getElementById("thread");
  var choices = document.getElementById("choices");
  var form = document.getElementById("free");
  var input = document.getElementById("free-text");
  var leadBox = document.getElementById("lead");
  var leadForm = document.getElementById("lead-form");
  var leadStatus = document.getElementById("lead-status");

  function add(role, text) {
    var el = document.createElement("div");
    el.className = "msg " + role;
    el.textContent = text;
    thread.appendChild(el);
    el.scrollIntoView({ behavior: "smooth", block: "end" });
  }
  function typing(on) {
    var t = document.getElementById("typing");
    t.hidden = !on;
    if (on) t.scrollIntoView({ behavior: "smooth", block: "end" });
  }
  function showChoices(opts) {
    choices.innerHTML = "";
    (opts || []).forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "choice"; b.textContent = o;
      b.addEventListener("click", function () { send(o); });
      choices.appendChild(b);
    });
    choices.hidden = !(opts && opts.length);
    form.hidden = !!(opts && opts.length);
    if (!form.hidden) input.focus();
  }

  function ask() {
    typing(true); choices.hidden = true; form.hidden = true;
    var p = BACKEND_URL
      ? fetch(BACKEND_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ session: session, messages: messages }) }).then(function (r) { return r.json(); })
      : new Promise(function (res) { setTimeout(function () { res(DEMO[Math.min(messages.filter(function (m) { return m.role === "assistant"; }).length, DEMO.length - 1)]); }, 600); });
    p.then(function (d) {
      typing(false);
      if (!d || d.error) { add("assistant", "משהו השתבש רגע. נסי שוב."); showChoices([]); return; }
      messages.push({ role: "assistant", content: JSON.stringify(d) });
      add("assistant", d.reply);
      if (d.done) { lastSummary = d.summary || ""; choices.hidden = true; form.hidden = true; leadBox.hidden = false; leadBox.scrollIntoView({ behavior: "smooth", block: "end" }); return; }
      showChoices(d.options);
    }).catch(function () { typing(false); add("assistant", "משהו השתבש רגע. נסי שוב."); showChoices([]); });
  }
  function send(text) {
    text = (text || "").trim(); if (!text) return;
    add("user", text);
    messages.push({ role: "user", content: text });
    ask();
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); var t = input.value; input.value = ""; send(t); });

  leadForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = leadForm.name.value.trim(), phone = leadForm.phone.value.trim();
    if (!name || !phone) { leadStatus.textContent = "צריך שם וטלפון."; return; }
    leadForm.querySelector("button").disabled = true;
    try {
      var transcript = messages.map(function (m) { var c = m.content; if (m.role === "assistant") { try { c = JSON.parse(c).reply; } catch (x) {} } return (m.role === "user" ? "היא: " : "AI: ") + c; }).join("\n");
      if (window.sendLeadToSheet) window.sendLeadToSheet({ form: "ai-funnel", id: session, name: name, phone: phone, email: "", callTime: "", age: "", reps: (lastSummary || "") + "\n---\n" + transcript });
      if (typeof gtag === "function") gtag("event", "ai_funnel_lead", { form_name: "ai_funnel" });
    } catch (x) {}
    leadStatus.textContent = "תודה! אחזור אלייך בהקדם האפשרי. לאה";
  });

  // פתיחה: הודעה ראשונה מה-AI
  messages.push({ role: "user", content: "[התחלה]" });
  ask();
})();
