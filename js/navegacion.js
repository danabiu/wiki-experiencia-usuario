/* =====================================================
   Wiki Design · Experiencia de usuario
   Navegación interna · Proyecto integrador etapa 5
   - Menú lateral: tema activo según el desplazamiento
   - Botón flotante «Subir»
   - Visor de recursos con Anterior / Siguiente
   - Buscador, actividad del concierto y formulario
   ===================================================== */

/* ---------- Datos de los seis recursos ---------- */
var recursos = [
  { src: "img/R1_concierto_storytelling.webp", titulo: "R1 · El concierto de tus sueños.", texto: "Ilustración vectorial. El escenario es la interfaz; los pasillos, la experiencia.", ancla: "#concierto" },
  { src: "img/R2_infografia_UI_vs_UX.webp", titulo: "R2 · UI vs. UX: el iceberg.", texto: "Infografía. La interfaz es la punta visible; la experiencia está debajo.", ancla: "#ui-ux" },
  { src: "img/R3_zonas_alcance_pulgar.webp", titulo: "R3 · Zonas de alcance del pulgar.", texto: "Diagrama con base en Hoober (2013). La lupa de búsqueda cae en la zona difícil.", ancla: "#ergonomia" },
  { src: "img/R4_mapa_calor_toques.webp", titulo: "R4 · Mapa de calor de toques.", texto: "Tres sesiones de uso de YouTube Music grabadas con «Mostrar toques».", ancla: "#mapas" },
  { src: "img/R5_comparativo_problema_solucion.webp", titulo: "R5 · Problema vs. solución.", texto: "Comparativo de la versión actual y la propuesta de rediseño.", ancla: "#rediseno" },
  { src: "img/R6_animacion_toques.webp", titulo: "R6 · ¿Cuántos toques para llegar a Ayuda?", texto: "Animación: 4 toques en la versión actual, 2 en la propuesta.", ancla: "#rediseno" }
];

/* ---------- Menú lateral en celular ---------- */
var lateral = document.getElementById("lateral");
var btnMenu = document.getElementById("btn-menu");

btnMenu.addEventListener("click", function () {
  var abierto = lateral.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
});

// Al elegir un tema del sumario en celular se cierra el menú
lateral.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    lateral.classList.remove("abierto");
    btnMenu.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Submenú de cada tema: se abre con el mouse encima y también con clic (táctil) ---------- */
document.querySelectorAll(".tema-boton").forEach(function (b) {
  b.addEventListener("click", function () {
    var item = b.parentNode;
    var abierto = item.classList.toggle("abierto");
    b.setAttribute("aria-expanded", abierto ? "true" : "false");
    document.querySelectorAll(".tema-item.abierto").forEach(function (o) {
      if (o !== item) { o.classList.remove("abierto"); o.querySelector(".tema-boton").setAttribute("aria-expanded", "false"); }
    });
  });
});
document.addEventListener("click", function (e) {
  if (!e.target.closest(".tema-item")) {
    document.querySelectorAll(".tema-item.abierto").forEach(function (o) { o.classList.remove("abierto"); o.querySelector(".tema-boton").setAttribute("aria-expanded", "false"); });
  }
});

/* ---------- Resaltar el apartado que se está leyendo ---------- */
var enlacesSumario = document.querySelectorAll("#sumario a");
var secciones = [];
enlacesSumario.forEach(function (a) {
  var sec = document.querySelector(a.getAttribute("href"));
  if (sec) secciones.push({ enlace: a, seccion: sec });
});

function actualizarActivo() {
  var y = window.scrollY + 120;
  var actual = secciones[0];
  secciones.forEach(function (s) {
    if (s.seccion.offsetTop <= y) actual = s;
  });
  secciones.forEach(function (s) { s.enlace.classList.remove("activo"); });
  if (actual) actual.enlace.classList.add("activo");
}

/* ---------- Botón flotante «Subir» ---------- */
var btnSubir = document.getElementById("btn-subir");

function mostrarBotonSubir() {
  if (window.scrollY > 500) {
    btnSubir.removeAttribute("hidden");
  } else {
    btnSubir.setAttribute("hidden", "");
  }
}

window.addEventListener("scroll", function () {
  actualizarActivo();
  mostrarBotonSubir();
});
actualizarActivo();
mostrarBotonSubir();

/* ---------- Visor de recursos ---------- */
var visor = document.getElementById("visor");
var visorImg = document.getElementById("visor-img");
var visorTitulo = document.getElementById("visor-titulo");
var visorTexto = document.getElementById("visor-texto");
var visorContador = document.getElementById("visor-contador");
var visorIr = document.getElementById("visor-ir");
var indiceActual = 0;
var botonOrigen = null;

function mostrarRecurso(i) {
  // Navegación circular: después del 6 vuelve al 1
  indiceActual = (i + recursos.length) % recursos.length;
  var r = recursos[indiceActual];
  visorImg.src = r.src;
  visorImg.alt = r.titulo;
  visorTitulo.textContent = r.titulo;
  visorTexto.textContent = r.texto;
  visorContador.textContent = (indiceActual + 1) + " / " + recursos.length;
  visorIr.href = r.ancla;
}

function abrirVisor(i, origen) {
  botonOrigen = origen || null;
  mostrarRecurso(i);
  visor.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("visor-cerrar").focus();
}

function cerrarVisor() {
  visor.setAttribute("hidden", "");
  document.body.style.overflow = "";
  if (botonOrigen) botonOrigen.focus();
}

document.querySelectorAll(".ver-recurso").forEach(function (b) {
  b.addEventListener("click", function () {
    abrirVisor(parseInt(b.getAttribute("data-recurso"), 10), b);
  });
});

document.getElementById("visor-cerrar").addEventListener("click", cerrarVisor);
document.getElementById("visor-anterior").addEventListener("click", function () { mostrarRecurso(indiceActual - 1); });
document.getElementById("visor-siguiente").addEventListener("click", function () { mostrarRecurso(indiceActual + 1); });
visorIr.addEventListener("click", cerrarVisor);

// Cerrar al hacer clic fuera de la caja
visor.addEventListener("click", function (e) {
  if (e.target === visor) cerrarVisor();
});

// Teclado: Esc cierra, flechas cambian de recurso
document.addEventListener("keydown", function (e) {
  if (visor.hasAttribute("hidden")) return;
  if (e.key === "Escape") cerrarVisor();
  if (e.key === "ArrowLeft") mostrarRecurso(indiceActual - 1);
  if (e.key === "ArrowRight") mostrarRecurso(indiceActual + 1);
});

/* ---------- Reproducir de nuevo la animación R6 ---------- */
var animacion = document.getElementById("animacion-r6");
document.getElementById("btn-reproducir").addEventListener("click", function () {
  // Al volver a asignar la ruta el navegador reinicia el WebP animado
  var ruta = animacion.getAttribute("src");
  animacion.setAttribute("src", "");
  animacion.setAttribute("src", ruta);
  animacion.scrollIntoView({ behavior: "smooth", block: "center" });
});

/* ---------- Buscador: lleva al apartado que coincide ---------- */
var indiceBusqueda = [
  { palabras: "introduccion ux experiencia usuario que es", ancla: "#introduccion" },
  { palabras: "concierto historia storytelling boletos estadio", ancla: "#concierto" },
  { palabras: "ui interfaz ux iceberg definicion iso", ancla: "#ui-ux" },
  { palabras: "comparacion tabla diferencias nielsen heuristicas", ancla: "#comparacion" },
  { palabras: "ergonomia pulgar alcance mano zonas hoober 48", ancla: "#ergonomia" },
  { palabras: "mapa calor toques android mostrar", ancla: "#mapas" },
  { palabras: "rediseno antes despues youtube music propuesta ayuda busqueda", ancla: "#rediseno" },
  { palabras: "conclusiones cierre", ancla: "#conclusiones" },
  { palabras: "recursos galeria multimedia imagenes animacion", ancla: "#recursos" },
  { palabras: "referencias apa fuentes bibliografia", ancla: "#referencias" },
  { palabras: "colabora formulario aportacion", ancla: "#colabora" },
  { palabras: "acerca nosotros equipo autores", ancla: "#acerca" }
];

function quitarAcentos(t) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

document.getElementById("buscador").addEventListener("submit", function (e) {
  e.preventDefault();
  var campo = document.getElementById("campo-busqueda");
  var termino = quitarAcentos(campo.value.trim());
  if (!termino) return;
  var destino = null;
  for (var i = 0; i < indiceBusqueda.length; i++) {
    if (indiceBusqueda[i].palabras.indexOf(termino) !== -1) { destino = indiceBusqueda[i].ancla; break; }
  }
  if (destino) {
    window.location.hash = destino;
  } else {
    campo.value = "";
    campo.placeholder = "Sin resultados para «" + termino + "»";
  }
});

/* ---------- Actividad «Decide tú» ---------- */
var opciones = document.querySelectorAll(".opcion");
var respuestaConcierto = document.getElementById("respuesta-concierto");
opciones.forEach(function (b) {
  b.addEventListener("click", function () {
    opciones.forEach(function (o) { o.classList.remove("elegida"); });
    b.classList.add("elegida");
    respuestaConcierto.textContent = b.getAttribute("data-respuesta");
  });
});

/* ---------- Formulario Colabora (demostración, no envía datos) ---------- */
document.getElementById("form-colabora").addEventListener("submit", function (e) {
  e.preventDefault();
  var nombre = document.getElementById("col-nombre").value.trim();
  document.getElementById("respuesta-colabora").textContent = "¡Gracias, " + nombre + "! Tu aportación quedó registrada en esta demostración.";
  this.reset();
});
