document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#advertise-form");
  if (!form) return;

  var statusEl = document.querySelector("#advertise-form-status");
  var progressEl = document.querySelector("#advertise-upload-progress");
  var bannerFileInput = document.querySelector("#advertiser-banner-file");

  var successModalClose = document.querySelector("#advertise-success-close");
  if (successModalClose) {
    successModalClose.addEventListener("click", function () {
      form.reset();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var bannerFile = bannerFileInput.files[0];
    if (!bannerFile) {
      statusEl.textContent = "יש לצרף קובץ באנר.";
      statusEl.classList.add("error");
      return;
    }
    if (bannerFile.size > 10 * 1024 * 1024) {
      statusEl.textContent = "קובץ הבאנר גדול מ-10MB. נסה/י קובץ קטן יותר.";
      statusEl.classList.add("error");
      return;
    }

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    statusEl.textContent = "";
    statusEl.classList.remove("error");
    progressEl.textContent = "שולח...";

    var submissionId = db.collection("ad_submissions").doc().id;
    var bannerPath = "ad_submissions/" + submissionId + "/" + bannerFile.name;

    storage.ref(bannerPath).put(bannerFile)
      .then(function (snap) {
        return snap.ref.getDownloadURL();
      })
      .then(function (bannerUrl) {
        progressEl.textContent = "שומר את הפרטים...";
        var createdAt = firebase.firestore.FieldValue.serverTimestamp();
        // Approved ad_submissions docs are publicly readable (js/banner-display.js),
        // so the advertiser's contact details go to the private ad_contacts/{same id}
        // doc instead (admin-only, see firestore.rules). Both are written in one batch.
        var submissionRef = db.collection("ad_submissions").doc(submissionId);
        var publicData = {
          advertiserName: form.advertiserName.value.trim(),
          page: form.page.value,
          size: form.size.value,
          duration: form.duration.value,
          link: form.link.value.trim(),
          bannerUrl: bannerUrl,
          status: "pending",
          createdAt: createdAt
        };
        var contactData = {
          contactName: form.contactName.value.trim(),
          phone: form.phone.value.trim(),
          email: form.email.value.trim(),
          notes: form.notes.value.trim(),
          createdAt: createdAt
        };
        var batch = db.batch();
        batch.set(submissionRef, publicData);
        batch.set(db.collection("ad_contacts").doc(submissionId), contactData);
        return batch.commit().catch(function (err) {
          if (!err || err.code !== "permission-denied") throw err;
          // Transitional: until the new firestore.rules are published, ad_contacts
          // has no rule and the batch is refused - save the request the old way
          // (one doc). Once the new rules are live this single write is refused
          // too. Safe to delete this fallback after the rules are live.
          console.warn("ad_contacts batch refused, using single-doc save", err.message);
          return submissionRef.set(Object.assign({}, publicData, {
            contactName: contactData.contactName,
            phone: contactData.phone,
            email: contactData.email,
            notes: contactData.notes
          }));
        });
      })
      .then(function () {
        progressEl.textContent = "";
        statusEl.textContent = "";
        statusEl.classList.remove("error");
        if (window.openSiteModal) {
          window.openSiteModal("advertise-success-modal");
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
