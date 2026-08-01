document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("#blog-grid");
  var pagination = document.querySelector("#blog-pagination");
  if (!grid || !pagination) return;

  var PAGE_SIZE = 6;
  var cards = Array.prototype.slice.call(grid.children);
  var totalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  var currentPage = 1;

  var prevBtn = document.querySelector("#blog-prev");
  var nextBtn = document.querySelector("#blog-next");
  var indicator = document.querySelector("#blog-page-indicator");

  if (totalPages <= 1) return;

  function render() {
    var start = (currentPage - 1) * PAGE_SIZE;
    var end = start + PAGE_SIZE;
    cards.forEach(function (card, i) {
      card.style.display = (i >= start && i < end) ? "" : "none";
    });
    indicator.textContent = "עמוד " + currentPage + " מתוך " + totalPages;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      render();
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      render();
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  pagination.hidden = false;
  render();
});
