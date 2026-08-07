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
        return db.collection("ad_submissions").doc(submissionId).set({
          advertiserName: form.advertiserName.value.trim(),
          contactName: form.contactName.value.trim(),
          phone: form.phone.value.trim(),
          email: form.email.value.trim(),
          page: form.page.value,
          size: form.size.value,
          duration: form.duration.value,
          link: form.link.value.trim(),
          notes: form.notes.value.trim(),
          bannerUrl: bannerUrl,
          status: "pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
