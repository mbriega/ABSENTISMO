// js/components/filters.js
// Filtrado de la tabla de patrones por categoría

const FiltersComponent = (() => {

  var activeFilter = "Todos";

  function render() {
    var container = document.getElementById("filter-buttons");
    if (!container) return;

    container.innerHTML = PATRONES_DATA.filtros.map(function(filtro) {
      var key   = typeof filtro === "object" ? filtro.key   : filtro;
      var label = typeof filtro === "object" ? filtro.label : filtro;
      return '<button class="filter-btn ' + (key === activeFilter ? "active" : "")
        + '" data-filter="' + key + '">' + label + "</button>";
    }).join("");

    container.querySelectorAll(".filter-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        activeFilter = btn.dataset.filter;
        render();
        TableComponent.render(activeFilter);
      });
    });
  }

  return {
    render:    render,
    getActive: function() { return activeFilter; }
  };
})();
