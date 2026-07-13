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

  function rowFromLegacyStory(id, story) {
    var row = document.createElement("div");
    row.className = "story-row";
    row.id = "story-" + id;
    row.innerHTML =
      '<div class="story-row-info">' +
      '<h3>' + escapeHtml(story.name || "") + '</h3>' +
      '<p>' + escapeHtml(summarize(story.bio, 400)) + '</p>' +
      '</div>' +
      '<div class="story-row-media"><div class="video-wrap"><video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video></div></div>';
    return row;
  }

  function rowFromSubmission(id, story) {
    var mediaHtml;
    if (story.videoUrl) {
      mediaHtml = '<video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video>';
    } else if (story.photoUrls && story.photoUrls.length) {
      mediaHtml = '<img src="' + story.photoUrls[0] + '" alt="" style="width:100%;height:100%;object-fit:cover;">';
    } else {
      mediaHtml = '<div class="video-placeholder">📖</div>';
    }
    var nameLine = escapeHtml(story.name || "") + (story.age ? ", " + escapeHtml(story.age) : "");

    var row = document.createElement("div");
    row.className = "story-row";
    row.id = "story-" + id;
    row.innerHTML =
      '<div class="story-row-info">' +
      '<h3>' + nameLine + '</h3>' +
      (story.location ? '<p class="story-location">' + escapeHtml(story.location) + '</p>' : '') +
      '<p>' + escapeHtml(summarize(story.story, 400)) + '</p>' +
      '</div>' +
      '<div class="story-row-media"><div class="video-wrap">' + mediaHtml + '</div></div>';
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
        list.innerHTML = '<p class="empty-state">עדיין אין סיפורים מפורסמים - היו הראשונים לשתף!</p>';
        return;
      }
      list.innerHTML = "";
      all.forEach(function (item) {
        var row = item.type === "legacy" ? rowFromLegacyStory(item.id, item.data) : rowFromSubmission(item.id, item.data);
        list.appendChild(row);
      });

      if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("story-row--highlight");
        }
      }
    })
    .catch(function (err) {
      console.error(err);
      list.innerHTML = '<p class="empty-state">לא ניתן לטעון את הסיפורים כרגע.</p>';
    });
});
