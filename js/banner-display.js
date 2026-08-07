document.addEventListener("DOMContentLoaded", function () {
  var slots = document.querySelectorAll(".banner-slot");
  if (!slots.length) return;

  var file = location.pathname.split("/").pop() || "index.html";
  var pageKey = file === "index.html" ? "index.html"
    : (file === "blog.html" || file.indexOf("blog-post-") === 0) ? "blog.html"
    : file === "stories.html" ? "stories.html"
    : "other";

  db.collection("ad_submissions")
    .where("status", "==", "approved")
    .where("page", "==", pageKey)
    .orderBy("createdAt", "desc")
    .limit(slots.length)
    .get()
    .then(function (snapshot) {
      if (snapshot.empty) return;
      var ads = snapshot.docs.map(function (doc) { return doc.data(); });
      slots.forEach(function (slot, i) {
        var ad = ads[i % ads.length];
        if (!ad) return;
        var inner = slot.querySelector(".banner-slot__inner");
        if (!inner) return;
        var link = document.createElement("a");
        link.href = ad.link;
        link.target = "_blank";
        link.rel = "noopener sponsored";
        var img = document.createElement("img");
        img.src = ad.bannerUrl;
        img.alt = ad.advertiserName || "פרסומת";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        link.appendChild(img);
        inner.replaceWith(link);
        slot.hidden = false;
      });
    })
    .catch(function (err) {
      console.error(err);
    });
});
