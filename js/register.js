document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#register-form");
  if (!form) return;

  var ageSelect = document.querySelector("#age");
  if (ageSelect) {
    for (var age = 18; age <= 100; age++) {
      var option = document.createElement("option");
      option.value = age;
      option.textContent = age;
      ageSelect.appendChild(option);
    }
  }

  form.addEventListener("input", function () {
    if (typeof gtag === "function") gtag("event", "form_start", { form_name: "story_submission" });
  }, { once: true });

  var statusEl = document.querySelector("#form-status");
  var progressEl = document.querySelector("#upload-progress");

  ["story", "turningPoint", "today", "message"].forEach(function (field) {
    var textarea = form[field];
    var counter = document.querySelector("#" + field + "-count");
    if (!textarea || !counter) return;
    var update = function () { counter.textContent = textarea.value.length; };
    textarea.addEventListener("input", update);
    update();
  });

  var successModalClose = document.querySelector("#registration-success-close");
  if (successModalClose) {
    successModalClose.addEventListener("click", function () {
      form.reset();
      document.querySelectorAll(".form-note span").forEach(function (span) { span.textContent = "0"; });
    });
  }

  var photosInput = document.querySelector("#photos");
  var photosNote = document.querySelector("#photos-note");
  photosInput.addEventListener("change", function () {
    if (photosInput.files.length > 5) {
      photosNote.textContent = "ניתן לבחור עד 5 תמונות בלבד - נא לבחור שוב.";
      photosNote.classList.add("error");
      photosInput.value = "";
    } else {
      photosNote.textContent = "אפשר לבחור עד 5 תמונות";
      photosNote.classList.remove("error");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (photosInput.files.length > 5) {
      statusEl.textContent = "ניתן להעלות עד 5 תמונות בלבד.";
      statusEl.classList.add("error");
      return;
    }

    var videoFile = form.video.files[0];

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    statusEl.textContent = "";
    statusEl.classList.remove("error");
    progressEl.textContent = "שולח...";

    var submissionId = db.collection("story_submissions").doc().id;
    var photoFiles = Array.from(photosInput.files);
    var uploads = [];

    photoFiles.forEach(function (file, index) {
      var path = "story_submissions/" + submissionId + "/photo_" + index + "_" + file.name;
      uploads.push(storage.ref(path).put(file).then(function (snap) {
        return snap.ref.getDownloadURL();
      }));
    });

    var videoUploadPromise = Promise.resolve(null);
    if (videoFile) {
      var videoPath = "story_submissions/" + submissionId + "/video_" + videoFile.name;
      videoUploadPromise = storage.ref(videoPath).put(videoFile).then(function (snap) {
        return snap.ref.getDownloadURL();
      });
    }

    Promise.all([Promise.all(uploads), videoUploadPromise])
      .then(function (results) {
        var photoUrls = results[0];
        var videoUrl = results[1];
        progressEl.textContent = "שומר את הפרטים...";
        return db.collection("story_submissions").doc(submissionId).set({
          name: form.name.value.trim(),
          age: form.age.value.trim(),
          location: form.location.value.trim(),
          phone: form.phone.value.trim(),
          email: form.email.value.trim(),
          story: form.story.value.trim(),
          turningPoint: form.turningPoint.value.trim(),
          today: form.today.value.trim(),
          message: form.message.value.trim(),
          links: form.links.value.trim(),
          photoUrls: photoUrls,
          videoUrl: videoUrl,
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(function () {
        progressEl.textContent = "";
        statusEl.textContent = "";
        statusEl.classList.remove("error");
        if (typeof gtag === "function") gtag("event", "story_submitted");
        if (window.openSiteModal) {
          window.openSiteModal("registration-success-modal");
        }
      })
      .catch(function (err) {
        console.error(err);
        progressEl.textContent = "";
        statusEl.textContent = "משהו השתבש בשליחת הטופס. נסה/י שוב.";
        statusEl.classList.add("error");
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
});
