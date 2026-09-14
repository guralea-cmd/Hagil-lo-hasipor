document.addEventListener("DOMContentLoaded", function () {
  auth.onAuthStateChanged(function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    loadContactSubmissions();
    loadSubmissions();
    cleanupOldSubmissions();
    loadStories();
    loadRegistrations();
    loadWorkshopLeads();
    loadPilatesLeads();
    loadEventSignups();
    loadPendingStoryEdits();
    setupContactMigration();
  });

  document.querySelector("#logout-btn").addEventListener("click", function () {
    auth.signOut().then(function () {
      window.location.href = "login.html";
    });
  });

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function formatDate(ts) {
    if (!ts || !ts.toDate) return "-";
    return ts.toDate().toLocaleDateString("he-IL");
  }

  function statusLabel(status) {
    var labels = { pending: "ממתין", approved: "מאושר", rejected: "נדחה" };
    return '<span class="status-pill ' + status + '">' + (labels[status] || status) + "</span>";
  }

  function truncate(str, max) {
    str = str || "";
    return str.length > max ? str.slice(0, max) + "…" : str;
  }

  function formatSource(r) {
    if (r.utmCampaign) return escapeHtml(r.utmCampaign);
    if (r.utmSource) return escapeHtml(r.utmSource);
    return "ישיר";
  }

  // Since 2026-09-13 contact details live in private, admin-only collections
  // (story_contacts / ad_contacts, same doc id as the public doc - see
  // firestore.rules). Docs saved before the move may still hold them on the public
  // doc, so fall back to those. If the private collection can't be read yet (new
  // rules not published), the table still loads with the old fields.
  function loadContactMap(collectionName) {
    return db.collection(collectionName).get().then(function (snapshot) {
      var map = {};
      snapshot.forEach(function (doc) { map[doc.id] = doc.data(); });
      return map;
    }).catch(function (err) {
      console.warn("Could not read " + collectionName, err && err.message);
      return {};
    });
  }

  function contactField(contacts, id, data, field) {
    var c = contacts[id];
    if (c && c[field] != null && c[field] !== "") return c[field];
    return data[field];
  }

  function loadSubmissions() {
    var body = document.querySelector("#submissions-body");
    Promise.all([
      db.collection("story_submissions").orderBy("createdAt", "desc").get(),
      loadContactMap("story_contacts")
    ]).then(function (results) {
      var snapshot = results[0];
      var contacts = results[1];
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="7">אין טפסים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var s = doc.data();
        var photos = (s.photoUrls || []).map(function (url) {
          return '<a href="' + url + '" target="_blank" rel="noopener"><img src="' + url + '" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:4px;margin:2px;"></a>';
        }).join("");
        var video = s.videoUrl ? '<video src="' + s.videoUrl + '" controls style="max-width:160px;display:block;margin-top:6px;"></video>' : "";
        var linksValue = contactField(contacts, doc.id, s, "links");
        var links = linksValue ? '<div style="margin-top:6px;"><a href="' + escapeHtml(linksValue) + '" target="_blank" rel="noopener">קישורים</a></div>' : "";
        var storyText =
          "<strong>הסיפור:</strong> " + escapeHtml(truncate(s.story, 200)) + "<br>" +
          "<strong>הרגע המשנה:</strong> " + escapeHtml(truncate(s.turningPoint, 150)) + "<br>" +
          "<strong>היום:</strong> " + escapeHtml(truncate(s.today, 150)) + "<br>" +
          "<strong>המסר:</strong> " + escapeHtml(truncate(s.message, 150));
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(s.createdAt) + "</td>" +
          "<td>" + escapeHtml(s.name) + (s.age ? ", " + escapeHtml(s.age) : "") + "<br>" + escapeHtml(s.location) + "</td>" +
          '<td style="max-width:280px;">' + storyText + "</td>" +
          "<td>" + photos + video + links + "</td>" +
          "<td>" + escapeHtml(contactField(contacts, doc.id, s, "phone")) + "<br>" + escapeHtml(contactField(contacts, doc.id, s, "email")) + "</td>" +
          "<td>" + formatSource(s) + "</td>" +
          "<td>" + statusLabel(s.status) + "</td>" +
          "<td>" +
          '<button class="btn btn-sm approve-submission-btn" data-id="' + doc.id + '">אשר ופרסם</button> ' +
          '<button class="btn btn-outline btn-sm reject-submission-btn" data-id="' + doc.id + '">דחה</button> ' +
          (s.status === "approved" ? '<button class="btn btn-outline btn-sm delete-submission-btn" data-id="' + doc.id + '">מחק</button>' : "") +
          "</td>";
        body.appendChild(tr);
      });

      body.querySelectorAll(".approve-submission-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateSubmissionStatus(btn.dataset.id, "approved");
        });
      });
      body.querySelectorAll(".reject-submission-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateSubmissionStatus(btn.dataset.id, "rejected");
        });
      });
      body.querySelectorAll(".delete-submission-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          deleteSubmission(btn.dataset.id);
        });
      });
    });
  }

  function updateSubmissionStatus(id, status) {
    db.collection("story_submissions").doc(id).update({ status: status }).then(loadSubmissions);
  }

  function loadPendingStoryEdits() {
    var container = document.querySelector("#pending-story-edits");
    if (!container) return;
    var pending = (typeof PENDING_STORY_EDITS !== "undefined") ? PENDING_STORY_EDITS : [];
    if (!pending.length) {
      container.innerHTML = "<p>אין עריכות ממתינות כרגע.</p>";
      return;
    }
    container.innerHTML = "";
    pending.forEach(function (item, index) {
      var box = document.createElement("div");
      box.style.cssText = "border:1px solid #ddd; border-radius:8px; padding:12px; margin-bottom:10px;";
      box.innerHTML =
        "<strong>" + escapeHtml(item.name) + "</strong> (" + escapeHtml(item.collection) + " / " + escapeHtml(item.id) + ")<br>" +
        '<span style="color:#555;">' + escapeHtml(item.edited.hookLine || "") + "</span><br>" +
        '<button class="btn btn-sm apply-story-edit-btn" data-index="' + index + '">החלת עריכה</button> ' +
        '<span class="apply-status" style="margin-inline-start:8px;"></span>';
      container.appendChild(box);
    });
    container.querySelectorAll(".apply-story-edit-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = pending[Number(btn.dataset.index)];
        var statusEl = btn.nextElementSibling;
        btn.disabled = true;
        statusEl.textContent = "מעדכן...";
        db.collection(item.collection).doc(item.id).update({ edited: item.edited })
          .then(function () {
            statusEl.textContent = "עודכן בהצלחה ✓";
            statusEl.style.color = "green";
          })
          .catch(function (err) {
            statusEl.textContent = "שגיאה: " + err.message;
            statusEl.style.color = "red";
            btn.disabled = false;
          });
      });
    });
  }

  function deleteSubmission(id) {
    if (!confirm("למחוק לצמיתות את הסיפור הזה, כולל התמונות והווידאו שלו? אי אפשר לשחזר את זה.")) return;
    db.collection("story_submissions").doc(id).get().then(function (doc) {
      var s = doc.data() || {};
      (s.photoUrls || []).forEach(function (url) {
        storage.refFromURL(url).delete().catch(function () {});
      });
      if (s.videoUrl) {
        storage.refFromURL(s.videoUrl).delete().catch(function () {});
      }
      return Promise.all([
        doc.ref.delete(),
        db.collection("story_contacts").doc(id).delete().catch(function () {})
      ]);
    }).then(loadSubmissions);
  }

  function cleanupOldSubmissions() {
    var twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    db.collection("story_submissions").where("status", "==", "pending").get().then(function (snapshot) {
      snapshot.forEach(function (doc) {
        var s = doc.data();
        if (!s.createdAt || !s.createdAt.toDate) return;
        if (s.createdAt.toDate() < twoWeeksAgo) {
          (s.photoUrls || []).forEach(function (url) {
            storage.refFromURL(url).delete().catch(function () {});
          });
          if (s.videoUrl) {
            storage.refFromURL(s.videoUrl).delete().catch(function () {});
          }
          doc.ref.delete();
          db.collection("story_contacts").doc(doc.id).delete().catch(function () {});
        }
      });
    });
  }

  function loadStories() {
    var body = document.querySelector("#stories-body");
    Promise.all([
      db.collection("stories").orderBy("createdAt", "desc").get(),
      loadContactMap("story_contacts")
    ]).then(function (results) {
      var snapshot = results[0];
      var contacts = results[1];
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="7">אין סיפורים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var s = doc.data();
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(s.createdAt) + "</td>" +
          "<td>" + escapeHtml(s.name) + "</td>" +
          "<td>" + escapeHtml(s.bio) + "</td>" +
          '<td><video src="' + s.videoUrl + '" controls style="max-width:160px;"></video></td>' +
          "<td>" + escapeHtml(contactField(contacts, doc.id, s, "email")) + "</td>" +
          "<td>" + statusLabel(s.status) + "</td>" +
          '<td>' +
          '<button class="btn btn-sm approve-btn" data-id="' + doc.id + '">אשר</button> ' +
          '<button class="btn btn-outline btn-sm reject-btn" data-id="' + doc.id + '">דחה</button> ' +
          (s.status === "approved" ? '<button class="btn btn-outline btn-sm delete-story-btn" data-id="' + doc.id + '">מחק</button>' : "") +
          "</td>";
        body.appendChild(tr);
      });

      body.querySelectorAll(".approve-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateStatus(btn.dataset.id, "approved");
        });
      });
      body.querySelectorAll(".reject-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateStatus(btn.dataset.id, "rejected");
        });
      });
      body.querySelectorAll(".delete-story-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          deleteStory(btn.dataset.id);
        });
      });
    });
  }

  function updateStatus(id, status) {
    db.collection("stories").doc(id).update({ status: status }).then(loadStories);
  }

  function deleteStory(id) {
    if (!confirm("למחוק לצמיתות את הסיפור הזה, כולל הווידאו שלו? אי אפשר לשחזר את זה.")) return;
    db.collection("stories").doc(id).get().then(function (doc) {
      var s = doc.data() || {};
      if (s.videoUrl) {
        storage.refFromURL(s.videoUrl).delete().catch(function () {});
      }
      return Promise.all([
        doc.ref.delete(),
        db.collection("story_contacts").doc(id).delete().catch(function () {})
      ]);
    }).then(loadStories);
  }

  function loadRegistrations() {
    var body = document.querySelector("#registrations-body");
    db.collection("registrations").orderBy("createdAt", "desc").get().then(function (snapshot) {
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="5">אין נרשמים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var r = doc.data();
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(r.createdAt) + "</td>" +
          "<td>" + escapeHtml(r.name) + "</td>" +
          "<td>" + escapeHtml(r.phone) + "</td>" +
          "<td>" + escapeHtml(r.email) + "</td>" +
          "<td>" + escapeHtml(r.message) + "</td>";
        body.appendChild(tr);
      });
    });
  }

  function loadWorkshopLeads() {
    var body = document.querySelector("#workshop-leads-body");
    if (!body) return;
    db.collection("workshop_leads").orderBy("createdAt", "desc").get().then(function (snapshot) {
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="5">אין לידים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var r = doc.data();
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(r.createdAt) + "</td>" +
          "<td>" + escapeHtml(r.firstName) + " " + escapeHtml(r.lastName) + "</td>" +
          "<td>" + escapeHtml(r.email) + "</td>" +
          "<td>" + escapeHtml(r.phone) + "</td>" +
          "<td>" + formatSource(r) + "</td>" +
          '<td><button class="btn btn-outline btn-sm delete-workshop-lead-btn" data-id="' + doc.id + '">מחק</button></td>';
        body.appendChild(tr);
      });
      body.querySelectorAll(".delete-workshop-lead-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!confirm("למחוק ליד זה?")) return;
          db.collection("workshop_leads").doc(btn.dataset.id).delete().then(function () {
            loadWorkshopLeads();
          });
        });
      });
    });
  }

  function loadPilatesLeads() {
    var body = document.querySelector("#pilates-leads-body");
    if (!body) return;
    db.collection("pilates_leads").orderBy("createdAt", "desc").get().then(function (snapshot) {
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="5">אין נרשמים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var r = doc.data();
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(r.createdAt) + "</td>" +
          "<td>" + escapeHtml(r.name) + "</td>" +
          "<td>" + escapeHtml(r.phone) + "</td>" +
          "<td>" + formatSource(r) + "</td>" +
          '<td><button class="btn btn-outline btn-sm delete-pilates-lead-btn" data-id="' + doc.id + '">מחק</button></td>';
        body.appendChild(tr);
      });
      body.querySelectorAll(".delete-pilates-lead-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!confirm("למחוק ליד זה?")) return;
          db.collection("pilates_leads").doc(btn.dataset.id).delete().then(function () {
            loadPilatesLeads();
          });
        });
      });
    });
  }

  // Topic values come from the <select id="topic"> on contact.html - labels are that page's exact option text.
  var CONTACT_TOPIC_LABELS = {
    career: "מעבר קריירה / פרישה",
    personal: "צמיחה אישית",
    group: "קהילה",
    other: "אחר"
  };

  function formatDateTimeIsrael(ts) {
    if (!ts || !ts.toDate) return "-";
    return ts.toDate().toLocaleString("he-IL", {
      timeZone: "Asia/Jerusalem",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // Old site-health-scan test writes - never show them next to real messages.
  function isScanTestRecord(id, r) {
    // "בדיק" catches both "בדיקה מערכת" and "בדיקת מערכת" (the 1.9 record slipped through on "בדיקה").
    var email = String(r.email || "").toLowerCase();
    return id.indexOf("_healthscan") === 0 ||
      String(r.name || "").trim().indexOf("בדיק") === 0 ||
      /@(example\.com|test\.local)$/.test(email);
  }

  // contact_submissions is publicly writable, so rows are built with textContent / DOM
  // properties only (never innerHTML) to keep submitted text from injecting markup.
  function contactCell(label, className) {
    var td = document.createElement("td");
    if (label) td.setAttribute("data-label", label);
    if (className) td.className = className;
    return td;
  }

  function loadContactSubmissions() {
    var body = document.querySelector("#contact-submissions-body");
    if (!body) return;
    db.collection("contact_submissions").orderBy("createdAt", "desc").get().then(function (snapshot) {
      var rows = [];
      snapshot.forEach(function (doc) {
        var r = doc.data();
        if (!isScanTestRecord(doc.id, r)) rows.push({ id: doc.id, data: r });
      });
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="8">אין פניות עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      rows.forEach(function (row) {
        var r = row.data;
        var isNew = r.status !== "handled";
        var tr = document.createElement("tr");
        tr.className = isNew ? "contact-new" : "contact-handled";

        var dateTd = contactCell("תאריך", "contact-date");
        dateTd.textContent = formatDateTimeIsrael(r.createdAt);
        tr.appendChild(dateTd);

        var nameTd = contactCell("שם");
        nameTd.textContent = r.name || "-";
        tr.appendChild(nameTd);

        var phoneTd = contactCell("טלפון", "contact-phone");
        var phoneDigits = String(r.phone || "").replace(/[^\d+]/g, "");
        if (phoneDigits) {
          var phoneLink = document.createElement("a");
          phoneLink.href = "tel:" + phoneDigits;
          phoneLink.dir = "ltr";
          phoneLink.textContent = r.phone;
          phoneTd.appendChild(phoneLink);
        } else {
          phoneTd.textContent = r.phone || "-";
        }
        tr.appendChild(phoneTd);

        var emailTd = contactCell("אימייל", "contact-email");
        var email = String(r.email || "").trim();
        if (/^[^\s@"<>]+@[^\s@"<>]+$/.test(email)) {
          var emailLink = document.createElement("a");
          emailLink.href = "mailto:" + email;
          emailLink.dir = "ltr";
          emailLink.textContent = email;
          emailTd.appendChild(emailLink);
        } else {
          emailTd.textContent = email || "-";
        }
        tr.appendChild(emailTd);

        var topicTd = contactCell("נושא");
        topicTd.textContent = CONTACT_TOPIC_LABELS[r.topic] || r.topic || "-";
        tr.appendChild(topicTd);

        var msgTd = contactCell("הודעה", "contact-msg");
        msgTd.textContent = r.message || "-";
        tr.appendChild(msgTd);

        var statusTd = contactCell("סטטוס");
        var pill = document.createElement("span");
        pill.className = "status-pill " + (isNew ? "pending" : "approved");
        pill.textContent = isNew ? "חדש" : "טופל";
        statusTd.appendChild(pill);
        tr.appendChild(statusTd);

        var actionsTd = contactCell("", "contact-actions");
        if (isNew) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-sm";
          btn.textContent = "סמן כטופל";
          btn.addEventListener("click", function () {
            markContactHandled(row.id, btn);
          });
          actionsTd.appendChild(btn);
        }
        tr.appendChild(actionsTd);

        body.appendChild(tr);
      });
    }).catch(function (err) {
      body.innerHTML = '<tr><td colspan="8"></td></tr>';
      body.querySelector("td").textContent = "שגיאה: " + err.message;
    });
  }

  function markContactHandled(id, btn) {
    var originalText = btn.textContent;
    var old = btn.parentNode.querySelector(".contact-error");
    if (old) old.remove();
    btn.disabled = true;
    btn.textContent = "מעדכן...";
    db.collection("contact_submissions").doc(id).update({ status: "handled" })
      .then(loadContactSubmissions)
      .catch(function (err) {
        btn.disabled = false;
        btn.textContent = originalText;
        var errEl = document.createElement("span");
        errEl.className = "contact-error";
        errEl.textContent = "שגיאה: " + err.message;
        btn.parentNode.appendChild(errEl);
      });
  }

  // One-time button: moves phone / email (and other contact fields) out of the
  // publicly readable story and ad docs - logic in admin/contact-migration.js.
  function setupContactMigration() {
    var btn = document.querySelector("#migrate-contacts-btn");
    var statusEl = document.querySelector("#migrate-contacts-status");
    if (!btn || !statusEl || btn.dataset.ready) return;
    btn.dataset.ready = "1";
    btn.addEventListener("click", function () {
      if (!auth.currentUser || typeof migrateContactFields !== "function") return;
      btn.disabled = true;
      statusEl.style.color = "";
      statusEl.textContent = "מעדכן...";
      migrateContactFields(db, function () { return firebase.firestore.FieldValue.delete(); })
        .then(function (result) {
          statusEl.textContent = result.migrated
            ? "עודכן בהצלחה ✓ - הועברו פרטי קשר מ-" + result.migrated + " טפסים"
            : "עודכן בהצלחה ✓ - אין פרטי קשר להעברה";
          statusEl.style.color = "green";
          btn.disabled = false;
          loadSubmissions();
          loadStories();
        })
        .catch(function (err) {
          statusEl.textContent = "שגיאה: " + err.message +
            (err.migrated ? " (הועברו " + err.migrated + " טפסים לפני השגיאה)" : "");
          statusEl.style.color = "red";
          btn.disabled = false;
        });
    });
  }

  function loadEventSignups() {
    var body = document.querySelector("#event-signups-body");
    if (!body) return;
    db.collection("event_signups").orderBy("createdAt", "desc").get().then(function (snapshot) {
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="5">אין נרשמים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var r = doc.data();
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(r.createdAt) + "</td>" +
          "<td>" + escapeHtml(r.firstName) + " " + escapeHtml(r.lastName) + "</td>" +
          "<td>" + escapeHtml(r.age) + "</td>" +
          "<td>" + escapeHtml(r.phone) + "</td>" +
          "<td>" + escapeHtml(r.email) + "</td>";
        body.appendChild(tr);
      });
    });
  }
});
