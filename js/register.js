document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#register-form");
  if (!form) return;

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || null,
      utmMedium: params.get("utm_medium") || null,
      utmCampaign: params.get("utm_campaign") || null
    };
  }

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
        var utm = getUtmParams();
        var createdAt = firebase.firestore.FieldValue.serverTimestamp();
        // Approved story_submissions docs are publicly readable, so the submitter's
        // contact details go to the private story_contacts/{same id} doc instead
        // (admin-only, see firestore.rules). Both are written in one batch.
        var submissionRef = db.collection("story_submissions").doc(submissionId);
        var publicData = {
          name: form.name.value.trim(),
          age: form.age.value.trim(),
          location: form.location.value.trim(),
          story: form.story.value.trim(),
          turningPoint: form.turningPoint.value.trim(),
          today: form.today.value.trim(),
          message: form.message.value.trim(),
          photoUrls: photoUrls,
          videoUrl: videoUrl,
          utmSource: utm.utmSource,
          utmMedium: utm.utmMedium,
          utmCampaign: utm.utmCampaign,
          status: "pending",
          createdAt: createdAt
        };
        var contactData = {
          phone: form.phone.value.trim(),
          email: form.email.value.trim(),
          links: form.links.value.trim(),
          createdAt: createdAt
        };
        var batch = db.batch();
        batch.set(submissionRef, publicData);
        batch.set(db.collection("story_contacts").doc(submissionId), contactData);
        return batch.commit().catch(function (err) {
          if (!err || err.code !== "permission-denied") throw err;
          // Transitional: until the new firestore.rules are published, story_contacts
          // has no rule and the batch is refused - save the submission the old way
          // (one doc) so no real story is lost. Once the new rules are live this
          // single write is refused too, so it can never put contact details on a
          // public doc again. The admin "העברת פרטי קשר" button cleans up docs
          // saved this way. Safe to delete this fallback after the rules are live.
          console.warn("story_contacts batch refused, using single-doc save", err.message);
          return submissionRef.set(Object.assign({}, publicData, {
            phone: contactData.phone,
            email: contactData.email,
            links: contactData.links
          }));
        });
      })
      .then(function () {
        progressEl.textContent = "";
        statusEl.textContent = "";
        statusEl.classList.remove("error");
        if (typeof gtag === "function") gtag("event", "story_submitted", { form_name: "story_submission" });
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
