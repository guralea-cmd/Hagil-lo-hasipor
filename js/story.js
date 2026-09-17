// Single-story landing page (story.html?id={docId}) for paid story ads.
// Reads ONE approved doc from `story_submissions` and renders it with the same
// fields/structure js/stories.js uses (edited.hookLine / summary / sections /
// closingLine, falling back to the raw story/turningPoint/today/message).
//
// Reads go straight to the Firestore REST endpoint (one small GET) instead of
// loading the ~400KB Firebase SDK first - ad visitors were leaving within ~2s,
// so time-to-story matters more than anything else here. Same project and web
// API key as js/firebase-config.js; security rules still only allow reading
// docs whose status is "approved". This script never writes anything.
(function () {
  var FIRESTORE_PROJECT_ID = "hagil-lo-hasipor";
  var FIRESTORE_API_KEY = "AIzaSyDpIyfmtt5rSJ10tkXrqURup6iE4utfTig";
  var BASE_TITLE = "הגיל הוא לא הסיפור";

  var container = document.getElementById("story");
  if (!container) return;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
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

  // Firestore REST returns typed values ({stringValue: ...}) - unwrap them.
  function fromFirestoreValue(value) {
    if (!value || typeof value !== "object") return null;
    if ("stringValue" in value) return value.stringValue;
    if ("integerValue" in value) return String(value.integerValue);
    if ("doubleValue" in value) return value.doubleValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("timestampValue" in value) return value.timestampValue;
    if ("nullValue" in value) return null;
    if ("arrayValue" in value) {
      return (value.arrayValue.values || []).map(fromFirestoreValue);
    }
    if ("mapValue" in value) return fromFirestoreFields(value.mapValue.fields);
    return null;
  }

  function fromFirestoreFields(fields) {
    var out = {};
    Object.keys(fields || {}).forEach(function (key) {
      out[key] = fromFirestoreValue(fields[key]);
    });
    return out;
  }

  function showError() {
    container.removeAttribute("aria-busy");
    // Wording reused verbatim from js/stories.js (its load-failure message).
    container.innerHTML =
      '<div class="story-error">' +
      '<p role="alert">לא ניתן לטעון את הסיפורים כרגע.</p>' +
      '<a class="btn" href="stories.html">לכל הסיפורים</a>' +
      '</div>';
  }

  // Existing CTA block, copied verbatim from workshopCtaHtml() in js/stories.js.
  function workshopCtaHtml() {
    return '<div class="story-row-cta">' +
      '<p>רוצה לדעת איך להתחיל כבר היום לעשות שינוי? לחצי על הרשמה לסדנה ונחזור אלייך עם כל הפרטים.</p>' +
      '<a class="btn btn-sm" href="workshop.html">הרשמה לסדנה</a>' +
      '</div>';
  }

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

  function setMediaRatio(frame, width, height) {
    if (!width || !height) return;
    frame.style.setProperty("--ar", String(Math.round((width / height) * 10000) / 10000));
  }

  function render(id, story) {
    var name = story.name || "";
    var photos = (story.photoUrls || []).filter(function (url) {
      return url && !/\.hei[cf](\?|$)/i.test(url);
    });
    var edited = story.edited || null;
    var hookText = edited && edited.hookLine ? edited.hookLine : hookLine(story.story, 110);

    // Main visual: video (poster = first photo), else first photo, else placeholder.
    var mediaHtml;
    if (story.videoUrl) {
      mediaHtml = '<video controls playsinline preload="metadata"' +
        (photos.length ? ' poster="' + escapeAttr(photos[0]) + '"' : '') +
        ' src="' + escapeAttr(story.videoUrl) + '" aria-label="' + escapeAttr(name) + '"></video>';
    } else if (photos.length) {
      mediaHtml = '<img src="' + escapeAttr(photos[0]) + '" alt="' + escapeAttr(name) + '" fetchpriority="high">';
    } else {
      mediaHtml = '<div class="video-placeholder" aria-hidden="true">📖</div>';
    }

    var extraPhotos = story.videoUrl ? photos : photos.slice(1);
    var thumbsHtml = extraPhotos.length
      ? '<div class="story-row-thumbs">' + extraPhotos.map(function (url) {
          return '<a href="' + escapeAttr(url) + '" target="_blank" rel="noopener"><img src="' + escapeAttr(url) + '" alt="' + escapeAttr(name) + '" loading="lazy"></a>';
        }).join("") + '</div>'
      : '';

    var textBlocks;
    if (edited && edited.sections && edited.sections.length) {
      // The hook line shown at the top is usually the first section's body
      // word for word - skip that exact repeat so it isn't read twice in a row.
      var sections = edited.sections.filter(function (block, i) {
        return !(i === 0 && block && (block.body || "").trim() === (hookText || "").trim());
      });
      textBlocks = sections.map(function (block) {
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

    container.innerHTML =
      '<h1>' + escapeHtml(name) + (story.age ? ', ' + escapeHtml(story.age) : '') + '</h1>' +
      (story.location ? '<p class="story-location">' + escapeHtml(story.location) + '</p>' : '') +
      (hookText ? '<p class="story-hook">' + escapeHtml(hookText) + '</p>' : '') +
      '<div class="story-media">' + mediaHtml + '</div>' +
      '<div class="story-row-info">' +
      summaryBadgeHtml(edited, story.age) +
      textBlocks +
      thumbsHtml +
      workshopCtaHtml() +
      '<p class="story-back"><a class="btn btn-outline btn-sm" href="stories.html">לכל הסיפורים</a></p>' +
      '</div>';
    container.removeAttribute("aria-busy");

    if (name) document.title = name + " | " + BASE_TITLE;

    // Frame follows the media's real proportions (no black bars on portrait
    // video): photo size first as a quick guess, then the video's own size.
    var frame = container.querySelector(".story-media");
    var video = frame.querySelector("video");
    if (video) {
      if (photos.length) {
        var probe = new Image();
        probe.onload = function () {
          if (!video.videoWidth) setMediaRatio(frame, probe.naturalWidth, probe.naturalHeight);
        };
        probe.src = photos[0];
      }
      var applyVideoRatio = function () {
        setMediaRatio(frame, video.videoWidth, video.videoHeight);
      };
      video.addEventListener("loadedmetadata", applyVideoRatio);
      if (video.readyState >= 1) applyVideoRatio();
    } else {
      var img = frame.querySelector("img");
      if (img) {
        var applyImgRatio = function () { setMediaRatio(frame, img.naturalWidth, img.naturalHeight); };
        if (img.complete && img.naturalWidth) applyImgRatio();
        else img.addEventListener("load", applyImgRatio);
      }
    }

    // Same GA4 event js/stories.js sends when a story comes into view, so the
    // weekly per-story report counts landing-page views too.
    if (typeof gtag === "function") {
      gtag("event", "story_view", { story_id: id, story_name: name });
    }
  }

  var params = new URLSearchParams(location.search);
  var id = (params.get("id") || "").trim();
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) {
    showError();
    return;
  }

  var url = "https://firestore.googleapis.com/v1/projects/" + FIRESTORE_PROJECT_ID +
    "/databases/(default)/documents/story_submissions/" + encodeURIComponent(id) +
    "?key=" + FIRESTORE_API_KEY;

  var controller = typeof AbortController === "function" ? new AbortController() : null;
  var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;

  fetch(url, controller ? { signal: controller.signal } : undefined)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (doc) {
      if (timer) clearTimeout(timer);
      var story = fromFirestoreFields(doc && doc.fields);
      if (story.status !== "approved") throw new Error("not approved");
      render(id, story);
    })
    .catch(function (err) {
      if (timer) clearTimeout(timer);
      console.warn("story.html: could not load story", id, err && err.message);
      showError();
    });
})();
