document.addEventListener("DOMContentLoaded", function () {
  auth.onAuthStateChanged(function (user) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    loadStories();
    loadRegistrations();
  });

  document.querySelector("#logout-btn").addEventListener("click", function () {
    auth.signOut().then(function () {
      window.location.href = "login.html";
    });
  });

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function formatDate(ts) {
    if (!ts || !ts.toDate) return "-";
    return ts.toDate().toLocaleDateString("he-IL");
  }

  function statusLabel(status) {
    var labels = { pending: "ממתין", approved: "מאושר", rejected: "נדחה" };
    return '<span class="status-pill ' + status + '">' + (labels[status] || status) + "</span>";
  }

  function loadStories() {
    var body = document.querySelector("#stories-body");
    db.collection("stories").orderBy("createdAt", "desc").get().then(function (snapshot) {
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="7">אין סיפורים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var s = doc.data();
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(s.createdAt) + "</td>" +
          "<td>" + escapeHtml(s.name) + "</td>" +
          "<td>" + escapeHtml(s.bio) + "</td>" +
          '<td><video src="' + s.videoUrl + '" controls style="max-width:160px;"></video></td>' +
          "<td>" + escapeHtml(s.email) + "</td>" +
          "<td>" + statusLabel(s.status) + "</td>" +
          '<td>' +
          '<button class="btn btn-sm approve-btn" data-id="' + doc.id + '">אשר</button> ' +
          '<button class="btn btn-outline btn-sm reject-btn" data-id="' + doc.id + '">דחה</button>' +
          "</td>";
        body.appendChild(tr);
      });

      body.querySelectorAll(".approve-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateStatus(btn.dataset.id, "approved");
        });
      });
      body.querySelectorAll(".reject-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          updateStatus(btn.dataset.id, "rejected");
        });
      });
    });
  }

  function updateStatus(id, status) {
    db.collection("stories").doc(id).update({ status: status }).then(loadStories);
  }

  function loadRegistrations() {
    var body = document.querySelector("#registrations-body");
    db.collection("registrations").orderBy("createdAt", "desc").get().then(function (snapshot) {
      if (snapshot.empty) {
        body.innerHTML = '<tr><td colspan="5">אין נרשמים עדיין.</td></tr>';
        return;
      }
      body.innerHTML = "";
      snapshot.forEach(function (doc) {
        var r = doc.data();
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatDate(r.createdAt) + "</td>" +
          "<td>" + escapeHtml(r.name) + "</td>" +
          "<td>" + escapeHtml(r.phone) + "</td>" +
          "<td>" + escapeHtml(r.email) + "</td>" +
          "<td>" + escapeHtml(r.message) + "</td>";
        body.appendChild(tr);
      });
    });
  }
});
