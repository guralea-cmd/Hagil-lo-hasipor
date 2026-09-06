document.addEventListener("DOMContentLoaded", function () {
  var list = document.querySelector("#stories-grid");
  if (!list) return;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function summarize(text, max) {
    text = text || "";
    return text.length > max ? text.slice(0, max) + "…" : text;
  }

  function shareButtonHtml(id) {
    var storyUrl = location.origin + location.pathname + "#story-" + id;
    var shareHref = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(storyUrl);
    return '<p><a class="btn btn-outline btn-sm" href="' + shareHref + '" target="_blank" rel="noopener">שתפו בפייסבוק</a></p>';
  }

  function workshopCtaHtml() {
    return '<div class="story-row-cta">' +
      '<p>רוצה לדעת איך להתחיל כבר היום לעשות שינוי? לחצו על הרשמה לסדנה ונחזור אליכם עם כל הפרטים.</p>' +
      '<a class="btn btn-sm" href="workshop.html">הרשמה לסדנה</a>' +
      '</div>';
  }

  function shareYourStoryCtaHtml() {
    return '<div class="story-row-cta story-row-cta--outline">' +
      '<p>קל יותר לספר מלכתוב? שלחו לנו בוואטסאפ הודעה קולית עם הסיפור שלכם וכמה תמונות - אנחנו נעשה את השאר. יש לכם שאלה? כתבו אותה שם, ונענה לכם בכתב. הקו מקבל הודעות בלבד, לא שיחות.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">' +
      '<a class="btn btn-outline btn-sm" href="register.html">שתפו את הסיפור שלכם</a>' +
      '<a class="wa-btn" href="https://wa.me/972506991723?text=%D7%94%D7%99%D7%99%20%D7%9C%D7%90%D7%94%2C%20%D7%94%D7%A0%D7%94%20%D7%94%D7%A1%D7%99%D7%A4%D7%95%D7%A8%20%D7%A9%D7%9C%D7%99.%0A%D7%A9%D7%9D%2C%20%D7%92%D7%99%D7%9C%2C%20%D7%95%D7%9E%D7%90%D7%99%D7%A4%D7%94%3A%0A%D7%94%D7%97%D7%99%D7%99%D7%9D%20%D7%A9%D7%9C%D7%99%20%D7%9C%D7%A4%D7%A0%D7%99%3A%0A%D7%9E%D7%94%20%D7%A7%D7%A8%D7%94%2C%20%D7%94%D7%A8%D7%92%D7%A2%20%D7%A9%D7%94%D7%9B%D7%9C%20%D7%94%D7%A9%D7%AA%D7%A0%D7%94%3A%0A%D7%9E%D7%94%20%D7%A2%D7%A9%D7%99%D7%AA%D7%99%2C%20%D7%90%D7%99%D7%9A%20%D7%99%D7%A6%D7%90%D7%AA%D7%99%20%D7%9E%D7%96%D7%94%3A%0A%D7%90%D7%99%D7%A4%D7%94%20%D7%90%D7%A0%D7%99%20%D7%94%D7%99%D7%95%D7%9D%3A%0A%D7%9E%D7%94%20%D7%94%D7%9E%D7%A1%D7%A8%20%D7%A9%D7%9C%D7%99%20%D7%9C%D7%9E%D7%99%20%D7%A9%D7%A0%D7%9E%D7%A6%D7%90%20%D7%A2%D7%9B%D7%A9%D7%99%D7%95%20%D7%90%D7%99%D7%A4%D7%94%20%D7%A9%D7%90%D7%A0%D7%99%20%D7%94%D7%99%D7%99%D7%AA%D7%99%3A%0A(%D7%90%D7%A4%D7%A9%D7%A8%20%D7%92%D7%9D%20%D7%9C%D7%94%D7%A7%D7%9C%D7%99%D7%98%20%D7%94%D7%95%D7%93%D7%A2%D7%94%20%D7%A7%D7%95%D7%9C%D7%99%D7%AA%20%D7%91%D7%9E%D7%A7%D7%95%D7%9D%20%D7%9C%D7%9B%D7%AA%D7%95%D7%91%2C%20%D7%95%D7%9C%D7%A6%D7%A8%D7%A3%20%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA)" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.462 3.479 1.34 4.995L2 22l5.117-1.342a9.96 9.96 0 0 0 4.887 1.246h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.068a9.935 9.935 0 0 0-7.073-2.936zm5.831 15.828a8.283 8.283 0 0 1-5.831 2.416h-.003a8.27 8.27 0 0 1-4.213-1.152l-.302-.18-3.037.797.81-2.96-.197-.304a8.259 8.259 0 0 1-1.266-4.418c0-4.575 3.723-8.297 8.302-8.297a8.243 8.243 0 0 1 5.868 2.434 8.238 8.238 0 0 1 2.428 5.868 8.276 8.276 0 0 1-2.559 5.796z"/></svg><span>שלחו הודעה קולית בוואטסאפ</span></a>' +
      '</div>' +
      '</div>';
  }

  function hookLine(text, max) {
    text = (text || "").trim();
    if (!text) return "";
    if (text.length <= max) return text;
    var cut = text.slice(0, max);
    var lastSpace = cut.lastIndexOf(" ");
    if (lastSpace > max * 0.6) cut = cut.slice(0, lastSpace);
    return cut + "…";
  }

  // Editorial pass (hook line, מ/ל summary, structured sections) lives on the
  // Firestore doc itself under an `edited` field - see the
  // community-story-editing skill for the process. Stories without it fall
  // back to the raw story/turningPoint/today/message fields as submitted.
  function summaryBadgeHtml(edited, age) {
    if (edited && edited.summaryFrom && edited.summaryTo) {
      return '<p class="story-summary">מ: ' + escapeHtml(edited.summaryFrom) + ' ← ל: ' + escapeHtml(edited.summaryTo) +
        (age ? ' | בגיל: ' + escapeHtml(age) : '') + '</p>';
    }
    if (age) {
      return '<p class="story-summary">בגיל: ' + escapeHtml(age) + '</p>';
    }
    return '';
  }

  function headerHtml(name, age, location, hookText) {
    return '<div class="story-row-header">' +
      '<h3>' + escapeHtml(name || "") + (age ? ', ' + escapeHtml(age) : '') + '</h3>' +
      (location ? '<p class="story-location">' + escapeHtml(location) + '</p>' : '') +
      (hookText ? '<p class="story-hook">' + escapeHtml(hookText) + '</p>' : '') +
      '</div>';
  }

  function rowFromLegacyStory(id, story) {
    var row = document.createElement("div");
    row.className = "story-row";
    row.id = "story-" + id;
    row.dataset.storyName = story.name || "";
    row.innerHTML =
      headerHtml(story.name, null, null, hookLine(story.bio, 110)) +
      '<div class="story-row-media"><div class="video-wrap"><video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video></div></div>' +
      '<div class="story-row-info">' +
      '<p>' + escapeHtml(summarize(story.bio, 400)) + '</p>' +
      shareButtonHtml(id) +
      shareYourStoryCtaHtml() +
      workshopCtaHtml() +
      '</div>';
    return row;
  }

  function rowFromSubmission(id, story) {
    var photos = (story.photoUrls || []).filter(function (url) {
      return !/\.hei[cf](\?|$)/i.test(url);
    });
    var primaryHtml, primaryIsPhoto = false;
    if (story.videoUrl) {
      primaryHtml = '<video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video>';
    } else if (photos.length) {
      primaryIsPhoto = true;
      primaryHtml = '<img src="' + photos[0] + '" alt="" style="display:block;width:100%;height:auto;">';
    } else {
      primaryHtml = '<div class="video-placeholder">📖</div>';
    }
    var extraPhotos = story.videoUrl ? photos : photos.slice(1);
    var thumbsHtml = extraPhotos.length
      ? '<div class="story-row-thumbs">' + extraPhotos.map(function (url) {
          return '<a href="' + url + '" target="_blank" rel="noopener"><img src="' + url + '" alt=""></a>';
        }).join("") + '</div>'
      : '';
    var edited = story.edited || null;
    var hookText = edited && edited.hookLine ? edited.hookLine : hookLine(story.story, 110);

    var textBlocks;
    if (edited && edited.sections && edited.sections.length) {
      textBlocks = edited.sections.map(function (block) {
        return '<h4>' + escapeHtml(block.heading) + '</h4><p>' + escapeHtml(block.body) + '</p>';
      }).join("") + (edited.closingLine ? '<p class="story-closing">' + escapeHtml(edited.closingLine) + '</p>' : '');
    } else {
      textBlocks = [
        { label: "הסיפור", value: story.story },
        { label: "הרגע המשנה", value: story.turningPoint },
        { label: "היום", value: story.today },
        { label: "המסר", value: story.message }
      ].filter(function (block) { return block.value; })
        .map(function (block) {
          return '<h4>' + block.label + '</h4><p>' + escapeHtml(block.value) + '</p>';
        }).join("");
    }

    var row = document.createElement("div");
    row.className = "story-row";
    row.id = "story-" + id;
    row.dataset.storyName = story.name || "";
    row.innerHTML =
      headerHtml(story.name, story.age, story.location, hookText) +
      '<div class="story-row-media"><div class="' + (primaryIsPhoto ? 'photo-wrap' : 'video-wrap') + '">' + primaryHtml + '</div>' + thumbsHtml + '</div>' +
      '<div class="story-row-info">' +
      summaryBadgeHtml(edited, story.age) +
      textBlocks +
      shareButtonHtml(id) +
      shareYourStoryCtaHtml() +
      workshopCtaHtml() +
      '</div>';
    return row;
  }

  Promise.all([
    db.collection("stories").where("status", "==", "approved").orderBy("createdAt", "desc").get(),
    db.collection("story_submissions").where("status", "==", "approved").orderBy("createdAt", "desc").get()
  ])
    .then(function (results) {
      var legacyDocs = results[0].docs.map(function (doc) { return { id: doc.id, type: "legacy", data: doc.data() }; });
      var submissionDocs = results[1].docs.map(function (doc) { return { id: doc.id, type: "submission", data: doc.data() }; });
      var all = legacyDocs.concat(submissionDocs).sort(function (a, b) {
        var aTime = a.data.createdAt && a.data.createdAt.toMillis ? a.data.createdAt.toMillis() : 0;
        var bTime = b.data.createdAt && b.data.createdAt.toMillis ? b.data.createdAt.toMillis() : 0;
        return bTime - aTime;
      });

      if (!all.length) {
        list.innerHTML = '<div class="empty-state"><p>הסיפורים הראשונים בדרך — רוצים להיות ביניהם?</p><a href="register.html" class="btn">שתפו את הסיפור שלכם</a></div>';
        return;
      }
      list.innerHTML = "";
      var rows = all.map(function (item) {
        var row = item.type === "legacy" ? rowFromLegacyStory(item.id, item.data) : rowFromSubmission(item.id, item.data);
        list.appendChild(row);
        return row;
      });

      if (typeof gtag === "function" && typeof IntersectionObserver !== "undefined") {
        var seen = {};
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var row = entry.target;
            var storyId = row.id.replace(/^story-/, "");
            if (seen[storyId]) return;
            seen[storyId] = true;
            gtag("event", "story_view", { story_id: storyId, story_name: row.dataset.storyName || "" });
            observer.unobserve(row);
          });
        }, { threshold: 0.5 });
        rows.forEach(function (row) { observer.observe(row); });
      }

      // One story per "page" (no long scroll), with numbered page buttons -
      // matches Leah's request 2026-08-11 for a dignified, non-scrolling
      // per-story presentation instead of one long list.
      var pagination = document.querySelector("#stories-pagination");
      var totalPages = rows.length;
      var currentPage = 1;

      if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        var hashIndex = target ? rows.indexOf(target) : -1;
        if (hashIndex > -1) currentPage = hashIndex + 1;
      }

      function renderPage() {
        rows.forEach(function (row, i) {
          row.style.display = (i === currentPage - 1) ? "" : "none";
          row.classList.toggle("story-row--highlight", i === currentPage - 1);
        });
        if (!pagination) return;
        pagination.innerHTML = "";
        if (totalPages <= 1) {
          pagination.hidden = true;
          return;
        }
        for (var p = 1; p <= totalPages; p++) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-outline btn-sm";
          btn.textContent = String(p);
          btn.setAttribute("aria-current", p === currentPage ? "page" : "false");
          btn.disabled = p === currentPage;
          btn.addEventListener("click", (function (pageNum) {
            return function () {
              currentPage = pageNum;
              renderPage();
              history.replaceState(null, "", "#" + rows[pageNum - 1].id);
              list.scrollIntoView({ behavior: "smooth", block: "start" });
            };
          })(p));
          pagination.appendChild(btn);
        }
        pagination.hidden = false;
      }

      renderPage();
      if (window.location.hash) {
        list.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    })
    .catch(function (err) {
      console.error(err);
      list.innerHTML = '<p class="empty-state">לא ניתן לטעון את הסיפורים כרגע.</p>';
    });
});
