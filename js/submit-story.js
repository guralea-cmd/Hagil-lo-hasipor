document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#story-form");
  if (!form) return;

  var statusEl = document.querySelector("#form-status");
  var progressEl = document.querySelector("#upload-progress");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var file = form.video.files[0];
    if (!file) {
      statusEl.textContent = "נא להעלות קובץ וידאו קצר.";
      statusEl.classList.add("error");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      statusEl.textContent = "הקובץ גדול מ-100MB. נסה/י קובץ קטן יותר או דחוס/י אותו.";
      statusEl.classList.add("error");
      return;
    }

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    statusEl.textContent = "";
    statusEl.classList.remove("error");

    var storyId = db.collection("stories").doc().id;
    var filePath = "stories/" + storyId + "/" + file.name;
    var uploadTask = storage.ref(filePath).put(file);

    uploadTask.on("state_changed", function (snapshot) {
      var pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressEl.textContent = "מעלה וידאו... " + pct + "%";
    }, function (err) {
      console.error(err);
      statusEl.textContent = "ההעלאה נכשלה. נסה/י שוב.";
      statusEl.classList.add("error");
      submitBtn.disabled = false;
    }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (videoUrl) {
        return db.collection("stories").doc(storyId).set({
          name: form.name.value.trim(),
          bio: form.bio.value.trim(),
          email: form.email.value.trim(),
          videoUrl: videoUrl,
          videoPath: filePath,
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }).then(function () {
        progressEl.textContent = "";
        statusEl.textContent = "תודה! הסיפור שלך נשלח ויפורסם לאחר אישור.";
        form.reset();
      }).catch(function (err) {
        console.error(err);
        statusEl.textContent = "משהו השתבש בשמירת הסיפור. נסה/י שוב.";
        statusEl.classList.add("error");
      }).finally(function () {
        submitBtn.disabled = false;
      });
    });
  });
});
