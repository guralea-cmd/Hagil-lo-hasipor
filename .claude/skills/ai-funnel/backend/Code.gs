// משפך AI - צד שרת (Google Apps Script, web app). נבנה 5.10.2026.
// מקבל את השיחה מהדף maslul.html, שולח ל-Claude (Messages API, raw HTTP - ל-Apps Script אין SDK רשמי),
// ומחזיר JSON קבוע: { reply, options[], stage, done, summary }.
// המפתח נשמר ב-Script Properties (ANTHROPIC_API_KEY) - לעולם לא בקוד ולא בדף.
// פריסה: Deploy > New deployment > Web app, Execute as: Me (guralea@gmail.com), Who has access: Anyone.
// הפרומפט (השאלות של לאה) נשמר ב-Script Properties בשם SYSTEM_PROMPT, ומתעדכן בלי פריסה מחדש.

var MODEL = "claude-opus-5";
var API_URL = "https://api.anthropic.com/v1/messages";
var MAX_TURNS = 40; // הגנה: שיחה לא נגמרת

var RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string", description: "מה שהמדריכה אומרת עכשיו, בעברית, קצר, 1-3 משפטים" },
    options: { type: "array", items: { type: "string" }, description: "כפתורי תשובה (0-4). ריק = תשובה חופשית בטקסט" },
    stage: { type: "string", description: "שלב בשיחה, מילה אחת באנגלית, לסטטיסטיקה" },
    done: { type: "boolean", description: "true רק כשהשיחה הגיעה לסיכום ולהפניה ללאה" },
    summary: { type: "string", description: "כש-done=true: סיכום ללאה - איפה האישה היום, מה היא רוצה, מה מתאים לה. אחרת מחרוזת ריקה" }
  },
  required: ["reply", "options", "stage", "done", "summary"],
  additionalProperties: false
};

function doPost(e) {
  var out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    var messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) return out.setContent(JSON.stringify({ error: "no messages" }));
    if (messages.length > MAX_TURNS * 2) return out.setContent(JSON.stringify({ error: "too long" }));
    var props = PropertiesService.getScriptProperties();
    var key = props.getProperty("ANTHROPIC_API_KEY");
    var system = props.getProperty("SYSTEM_PROMPT");
    if (!key) return out.setContent(JSON.stringify({ error: "no api key" }));
    if (!system) return out.setContent(JSON.stringify({ error: "no system prompt" }));

    var req = {
      model: MODEL,
      max_tokens: 2000,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: messages.map(function (m) { return { role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 2000) }; }),
      output_config: { effort: "low", format: { type: "json_schema", schema: RESPONSE_SCHEMA } }
    };
    var res = UrlFetchApp.fetch(API_URL, {
      method: "post", contentType: "application/json", muteHttpExceptions: true,
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
      payload: JSON.stringify(req)
    });
    var code = res.getResponseCode(), text = res.getContentText();
    if (code !== 200) { log_("api " + code + " " + text.slice(0, 300)); return out.setContent(JSON.stringify({ error: "api " + code })); }
    var data = JSON.parse(text);
    if (data.stop_reason === "refusal") return out.setContent(JSON.stringify({ error: "refusal" }));
    var textBlock = (data.content || []).filter(function (b) { return b.type === "text"; })[0];
    var parsed = JSON.parse(textBlock.text);
    if (body.session) log_("turn session=" + body.session + " stage=" + parsed.stage + " done=" + parsed.done + " in=" + (data.usage && data.usage.input_tokens) + " out=" + (data.usage && data.usage.output_tokens));
    return out.setContent(JSON.stringify(parsed));
  } catch (err) {
    log_("error " + err);
    return out.setContent(JSON.stringify({ error: "server" }));
  }
}

// GET = בדיקת חיים, בלי לכתוב כלום
function doGet() {
  var props = PropertiesService.getScriptProperties();
  return ContentService.createTextOutput(JSON.stringify({ ok: true, model: MODEL, hasKey: !!props.getProperty("ANTHROPIC_API_KEY"), hasPrompt: !!props.getProperty("SYSTEM_PROMPT") })).setMimeType(ContentService.MimeType.JSON);
}

function log_(s) { try { console.log(s); } catch (e) {} }
