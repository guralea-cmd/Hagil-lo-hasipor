document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("#home-stories-grid");
  if (!grid) return;

  var MAX_ITEMS = 5;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function mediaFor(story) {
    if (story.videoUrl) {
      return '<video src="' + story.videoUrl + '" preload="metadata" muted style="width:100%;height:100%;object-fit:cover;"></video>';
    }
    if (story.photoUrls && story.photoUrls.length) {
      return '<img src="' + story.photoUrls[0] + '" alt="" style="width:100%;height:100%;object-fit:cover;">';
    }
    return "📖";
  }

  function excerptOf(text) {
    text = text || "";
    return text.length > 90 ? text.slice(0, 90) + "…" : text;
  }

  Promise.all([
    db.collection("stories").where("status", "==", "approved").orderBy("createdAt", "desc").limit(MAX_ITEMS).get(),
    db.collection("story_submissions").where("status", "==", "approved").orderBy("createdAt", "desc").limit(MAX_ITEMS).get()
  ])
    .then(function (results) {
      var legacy = results[0].docs.map(function (doc) { return { id: doc.id, type: "legacy", data: doc.data() }; });
      var submissions = results[1].docs.map(function (doc) { return { id: doc.id, type: "submission", data: doc.data() }; });
      var all = legacy.concat(submissions).sort(function (a, b) {
        var aTime = a.data.createdAt && a.data.createdAt.toMillis ? a.data.createdAt.toMillis() : 0;
        var bTime = b.data.createdAt && b.data.createdAt.toMillis ? b.data.createdAt.toMillis() : 0;
        return bTime - aTime;
      }).slice(0, MAX_ITEMS);

      if (!all.length) {
        grid.innerHTML = '<p class="empty-state">עדיין אין סיפורים מפורסמים - היו הראשונים לשתף!</p>';
        return;
      }

      grid.innerHTML = "";
      all.forEach(function (item) {
        var s = item.data;
        var name = item.type === "legacy"
          ? escapeHtml(s.name || "")
          : escapeHtml(s.name || "") + (s.age ? ", " + escapeHtml(s.age) : "");
        var excerpt = item.type === "legacy" ? s.bio : s.story;

        var a = document.createElement("a");
        a.href = "stories.html#story-" + item.id;
        a.className = "story-card";
        a.innerHTML =
          '<div class="story-video">' + mediaFor(s) + '</div>' +
          '<div class="story-body">' +
          '<h3 class="story-name">' + name + '</h3>' +
          '<p>' + escapeHtml(excerptOf(excerpt)) + '</p>' +
          '</div>';
        grid.appendChild(a);
      });
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את הסיפורים כרגע.</p>';
    });
});
