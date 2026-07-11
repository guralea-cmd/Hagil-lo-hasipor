document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("#stories-grid");
  if (!grid) return;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function cardFromLegacyStory(story) {
    var card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML =
      '<div class="story-video"><video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video></div>' +
      '<div class="story-body">' +
      '<p>' + escapeHtml(story.bio || "") + '</p>' +
      '<div class="story-name">' + escapeHtml(story.name || "") + '</div>' +
      '</div>';
    return card;
  }

  function cardFromSubmission(story) {
    var mediaHtml;
    if (story.videoUrl) {
      mediaHtml = '<video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video>';
    } else if (story.photoUrls && story.photoUrls.length) {
      mediaHtml = '<img src="' + story.photoUrls[0] + '" alt="" style="width:100%;height:100%;object-fit:cover;">';
    } else {
      mediaHtml = "📖";
    }
    var nameLine = escapeHtml(story.name || "") + (story.age ? ", " + escapeHtml(story.age) : "");
    var card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML =
      '<div class="story-video">' + mediaHtml + '</div>' +
      '<div class="story-body">' +
      '<p>' + escapeHtml(story.story || "") + '</p>' +
      '<div class="story-name">' + nameLine + '</div>' +
      '</div>';
    return card;
  }

  Promise.all([
    db.collection("stories").where("status", "==", "approved").orderBy("createdAt", "desc").get(),
    db.collection("story_submissions").where("status", "==", "approved").orderBy("createdAt", "desc").get()
  ])
    .then(function (results) {
      var legacyDocs = results[0].docs.map(function (doc) { return { type: "legacy", data: doc.data() }; });
      var submissionDocs = results[1].docs.map(function (doc) { return { type: "submission", data: doc.data() }; });
      var all = legacyDocs.concat(submissionDocs).sort(function (a, b) {
        var aTime = a.data.createdAt && a.data.createdAt.toMillis ? a.data.createdAt.toMillis() : 0;
        var bTime = b.data.createdAt && b.data.createdAt.toMillis ? b.data.createdAt.toMillis() : 0;
        return bTime - aTime;
      });

      if (!all.length) {
        grid.innerHTML = '<p class="empty-state">עדיין אין סיפורים מפורסמים - היו הראשונים לשתף!</p>';
        return;
      }
      grid.innerHTML = "";
      all.forEach(function (item) {
        var card = item.type === "legacy" ? cardFromLegacyStory(item.data) : cardFromSubmission(item.data);
        grid.appendChild(card);
      });
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את הסיפורים כרגע.</p>';
    });
});
