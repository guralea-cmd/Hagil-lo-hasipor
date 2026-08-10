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
    var photos = story.photoUrls || [];
    var primaryHtml;
    if (story.videoUrl) {
      primaryHtml = '<video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video>';
    } else if (photos.length) {
      primaryHtml = '<img src="' + photos[0] + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;">';
    } else {
      primaryHtml = '<div class="video-placeholder">📖</div>';
    }
    var extraPhotos = story.videoUrl ? photos : photos.slice(1);
    var thumbsHtml = extraPhotos.length
      ? '<div class="story-row-thumbs">' + extraPhotos.map(function (url) {
          return '<a href="' + url + '" target="_blank" rel="noopener"><img src="' + url + '" alt=""></a>';
        }).join("") + '</div>'
      : '';
    var nameLine = escapeHtml(story.name || "") + (story.age ? ", " + escapeHtml(story.age) : "");

    var textBlocks = [
      { label: "הסיפור", value: story.story },
      { label: "הרגע המשנה", value: story.turningPoint },
      { label: "היום", value: story.today },
      { label: "המסר", value: story.message }
    ].filter(function (block) { return block.value; })
      .map(function (block) {
        return '<p><strong>' + block.label + ':</strong> ' + escapeHtml(block.value) + '</p>';
      }).join("");

    var row = document.createElement("div");
    row.className = "story-row";
    row.id = "story-" + id;
    row.innerHTML =
      '<div class="story-row-info">' +
      '<h3>' + nameLine + '</h3>' +
      (story.location ? '<p class="story-location">' + escapeHtml(story.location) + '</p>' : '') +
      textBlocks +
      '</div>' +
      '<div class="story-row-media"><div class="video-wrap">' + primaryHtml + '</div>' + thumbsHtml + '</div>';
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
