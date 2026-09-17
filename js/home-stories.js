document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("#home-stories-grid");
  if (!grid) return;

  var MAX_ITEMS = 8;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function mediaFor(story) {
    var photos = (story.photoUrls || []).filter(function (url) {
      return !/\.hei[cf](\?|$)/i.test(url);
    });
    if (photos.length) {
      return '<img src="' + photos[0] + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;">';
    }
    if (story.videoUrl) {
      return '<video src="' + story.videoUrl + '" preload="metadata" muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;"></video>';
    }
    return "📖";
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
        grid.innerHTML = '<div class="empty-state"><p>הסיפורים הראשונים בדרך — רוצים להיות ביניהם?</p><a href="register.html" class="btn">שתפו את הסיפור שלכם</a></div>';
        return;
      }

      grid.innerHTML = "";
      all.forEach(function (item) {
        var s = item.data;
        var name = item.type === "legacy"
          ? escapeHtml(s.name || "")
          : escapeHtml(s.name || "") + (s.age ? ", " + escapeHtml(s.age) : "");
        var storyHref = "stories.html#story-" + item.id;
        var shareHref = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(location.origin + "/" + storyHref);

        var card = document.createElement("div");
        card.className = "story-card";
        card.innerHTML =
          '<a href="' + storyHref + '" style="display:contents;">' +
          '<div class="story-video">' + mediaFor(s) + '</div>' +
          '<div class="story-body">' +
          '<h3 class="story-name">' + name + '</h3>' +
          '</div>' +
          '</a>' +
          '<p style="margin:0; padding:0 var(--space-3) var(--space-2);"><a class="btn btn-outline btn-sm" href="' + shareHref + '" target="_blank" rel="noopener">שתפו בפייסבוק</a></p>';
        grid.appendChild(card);
      });
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את הסיפורים כרגע.</p>';
    });
});
