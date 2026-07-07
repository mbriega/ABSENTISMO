// js/components/sidebar.js
// Sidebar de navegación — componente reutilizable

const SidebarComponent = (() => {

  const NAV_ITEMS = [
    { href: "/diagnostico",        label: "Diagnóstico",           icon: "chart-bar",   indent: false },
    { href: "/diagnostico/costes", label: "Costes",                icon: "currency",    indent: true  },
    { href: "/patrones", link: "patrones.html", label: "Patrones", icon: "search", indent: false, badge: true },
    { href: "/prediccion", link: "prediccion.html", label: "Predicción", icon: "trending-up", indent: false },
    { href: "/impacto-liderazgo",  label: "Impacto del Liderazgo", icon: "users",       indent: false },
    { href: "/red-organizativa",   label: "Red Organizativa",      icon: "lightning",   indent: false },
    { href: "/planes-accion",      label: "Planes de Acción",      icon: "clipboard",   indent: false },
    { href: "/implantacion",       label: "Implantación",          icon: "shield",      indent: false },
    { href: "/datos",              label: "Fuente de datos",       icon: "database",    indent: false }
  ];

  const ICONS = {
    "chart-bar":   '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
    "currency":    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    "search":      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>',
    "trending-up": '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>',
    "users":       '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>',
    "lightning":   '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
    "clipboard":   '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>',
    "shield":      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
    "database":    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4 8 4s8-1.79 8-4"/>',
    "settings":    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>'
  };

  function svgIcon(name) {
    return '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
      + (ICONS[name] || "") + "</svg>";
  }

  function getActivePath() {
    var page = document.body.dataset.page || "";
    if (page === "patrones" || page === "pat-detail") return "/patrones";
    return "/" + page;
  }

  function buildNavLink(item, activePath) {
    var isActive = item.href === activePath;
    var mlClass  = item.indent ? " ml-7" : "";
    var stateClass = isActive
      ? "text-white bg-white/20"
      : "text-surface-300 hover:text-[#e2e8f0] hover:bg-white/20";

    return '<a href="' + (item.link || item.href) + '" class="nav-link'
      + (isActive ? " nav-link--active" : "")
      + " flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm "
      + stateClass + " transition-colors" + mlClass + '">'
      + svgIcon(item.icon)
      + "<span>" + item.label + "</span>"
      + (isActive && item.badge ? '<span class="ml-auto w-2 h-2 bg-primary-400 rounded-full"></span>' : "")
      + "</a>";
  }

  function render() {
    var mount = document.getElementById("sidebar-mount");
    if (!mount) return;

    var activePath = getActivePath();
    var navLinks   = NAV_ITEMS.map(function(item) { return buildNavLink(item, activePath); }).join("");

    mount.innerHTML =
      '<aside id="sidebar" class="fixed top-0 left-0 z-40 w-[260px] bg-surface-800 flex flex-col transition-all duration-300 ease-in-out" style="height:100vh;">'

      // Logo
      + '<div class="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">'
      + '<div class="w-9 h-9 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shrink-0">'
      + '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 9l10 13L22 9 12 2z"/></svg>'
      + "</div>"
      + '<div><div class="text-white font-semibold text-sm tracking-wide">ThirdWish</div>'
      + '<div class="text-white/40 text-[10px] tracking-widest uppercase">Intelligence</div></div>'
      + "</div>"

      // Nav
      + '<nav class="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">' + navLinks + "</nav>"

      // Footer
      + '<div class="px-3 py-3 border-t border-white/[0.06]">'
      + '<a href="/configuracion" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-300 hover:text-[#e2e8f0] hover:bg-white/20 transition-colors">'
      + svgIcon("settings")
      + "<span>Configuración</span></a>"
      + '<p class="text-[10px] text-surface-400 px-3 mt-2">AbsenceIQ · powered by ThirdWish People</p>'
      + "</div>"

      // Collapse button
      + '<button id="btn-collapse-sidebar" class="absolute -right-3.5 top-7 w-7 h-7 bg-white border border-surface-200 rounded-full flex items-center justify-center shadow-sm hover:bg-surface-50 transition-colors">'
      + '<svg id="collapse-icon" class="w-3.5 h-3.5 text-surface-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
      + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>'
      + "</svg></button>"

      + "</aside>";

    // Collapse logic
    var btn     = document.getElementById("btn-collapse-sidebar");
    var sidebar = document.getElementById("sidebar");
    var icon    = document.getElementById("collapse-icon");

    if (btn && sidebar) {
      btn.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");
        var collapsed = sidebar.classList.contains("collapsed");
        if (icon) icon.style.transform = collapsed ? "rotate(180deg)" : "";
      });
    }
  }

  return { render: render };
})();
