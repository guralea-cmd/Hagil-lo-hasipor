document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("#stories-grid");
  if (!grid) return;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function cardFromLegacyStory(id, story) {
    var card = document.createElement("div");
    card.className = "story-card";
    card.id = "story-" + id;
    card.innerHTML =
      '<div class="story-video"><video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video></div>' +
      '<div class="story-body">' +
      '<p>' + escapeHtml(story.bio || "") + '</p>' +
      '<div class="story-name">' + escapeHtml(story.name || "") + '</div>' +
      '</div>';
    return card;
  }

  function cardFromSubmission(id, story) {
    var mediaHtml;
    if (story.videoUrl) {
      mediaHtml = '<video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video>';
    } else if (story.photoUrls && story.photoUrls.length) {
      mediaHtml = '<img src="' + story.photoUrls[0] + '" alt="" style="width:100%;height:100%;object-fit:cover;">';
    } else {
      mediaHtml = "📖";
    }
    var nameLine = escapeHtml(story.name || "") + (story.age ? ", " + escapeHtml(story.age) : "");

    var extraPhotos = "";
    var galleryUrls = story.photoUrls || [];
    if (story.videoUrl) {
      // video is already the main media, show all photos in the gallery
    } else {
      galleryUrls = galleryUrls.slice(1);
    }
    if (galleryUrls.length) {
      extraPhotos = '<div class="story-gallery">' + galleryUrls.map(function (url) {
        return '<img src="' + url + '" alt="">';
      }).join("") + '</div>';
    }

    var linksHtml = story.links ? '<p><a href="' + escapeHtml(story.links) + '" target="_blank" rel="noopener">קישורים נוספים</a></p>' : "";

    var card = document.createElement("div");
    card.className = "story-card";
    card.id = "story-" + id;
    card.innerHTML =
      '<div class="story-video">' + mediaHtml + '</div>' +
      '<div class="story-body">' +
      '<h3 class="story-name">' + nameLine + '</h3>' +
      (story.location ? '<p class="form-note">' + escapeHtml(story.location) + '</p>' : '') +
      '<p>' + escapeHtml(story.story || "") + '</p>' +
      (story.turningPoint ? '<p><strong>הרגע ששינה הכול:</strong> ' + escapeHtml(story.turningPoint) + '</p>' : '') +
      (story.today ? '<p><strong>מה קורה היום:</strong> ' + escapeHtml(story.today) + '</p>' : '') +
      (story.message ? '<p><strong>המסר שלי:</strong> ' + escapeHtml(story.message) + '</p>' : '') +
      linksHtml + extraPhotos +
      '</div>';
    return card;
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
        grid.innerHTML = '<p class="empty-state">עדיין אין סיפורים מפורסמים - היו הראשונים לשתף!</p>';
        return;
      }
      grid.innerHTML = "";
      all.forEach(function (item) {
        var card = item.type === "legacy" ? cardFromLegacyStory(item.id, item.data) : cardFromSubmission(item.id, item.data);
        grid.appendChild(card);
      });

      if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("story-card--highlight");
        }
      }
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את הסיפורים כרגע.</p>';
    });
});
