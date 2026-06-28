document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("#stories-grid");
  if (!grid) return;

  db.collection("stories")
    .where("status", "==", "approved")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (snapshot) {
      if (snapshot.empty) {
        grid.innerHTML = '<p class="empty-state">עדיין אין סיפורים מפורסמים - היו הראשונים לשתף!</p>';
        return;
      }
      grid.innerHTML = "";
      snapshot.forEach(function (doc) {
        var story = doc.data();
        var card = document.createElement("div");
        card.className = "story-card";
        card.innerHTML =
          '<div class="story-video"><video src="' + story.videoUrl + '" controls preload="metadata" style="width:100%;height:100%;"></video></div>' +
          '<div class="story-body">' +
          '<p>' + escapeHtml(story.bio || "") + '</p>' +
          '<div class="story-name">' + escapeHtml(story.name || "") + '</div>' +
          '</div>';
        grid.appendChild(card);
      });
    })
    .catch(function (err) {
      console.error(err);
      grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את הסיפורים כרגע.</p>';
    });

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
