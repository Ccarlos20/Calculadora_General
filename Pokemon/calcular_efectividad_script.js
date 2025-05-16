const tipos = ["Normal", "Fuego", "Agua", "Planta", "Eléctrico",
   "Hielo", "Lucha","Veneno", "Tierra", "Volador",
    "Psíquico", "Bicho", "Roca", "Fantasma", "Dragón",
     "Siniestro", "Acero", "Hada"];

const selects = document.querySelectorAll('.select-tipo');

selects.forEach((select, i) => {
  const isTipo1 = i % 2 === 0;
  const label = 'Ninguno';
  select.innerHTML = `<option value="">${label}</option>` + 
    tipos.map(t => `<option value="${t}">${t}</option>`).join('');
  select.addEventListener('change', mostrarEfectividadTabla);
});

const efectividades = {
  Fuego: ["Planta", "Hielo", "Bicho", "Acero"],
  Agua: ["Fuego", "Roca", "Tierra"],
  Planta: ["Agua", "Roca", "Tierra"],
  Eléctrico: ["Agua", "Volador"],
  Hielo: ["Planta", "Dragón", "Tierra", "Volador"],
  Lucha: ["Normal", "Hielo", "Roca", "Siniestro", "Acero"],
  Veneno: ["Planta", "Hada"],
  Tierra: ["Fuego", "Eléctrico", "Veneno", "Roca", "Acero"],
  Volador: ["Planta", "Lucha", "Bicho"],
  Psíquico: ["Lucha", "Veneno"],
  Bicho: ["Planta", "Psíquico", "Siniestro"],
  Roca: ["Fuego", "Hielo", "Volador", "Bicho"],
  Fantasma: ["Psíquico", "Fantasma"],
  Siniestro: ["Psíquico", "Fantasma"],
  Dragón: ["Dragón"],
  Acero: ["Hielo", "Roca", "Hada"],
  Hada: ["Lucha", "Siniestro", "Dragón"],
  // Puedes completar más tipos y sus efectividades
};

function mostrarEfectividadTabla() {
  const tiposEquipo = [];

  for (let i = 1; i <= 6; i++) {
    const t1 = document.getElementById(`tipo1_pokemon${i}`).value;
    const t2 = document.getElementById(`tipo2_pokemon${i}`).value;
    if (t1) tiposEquipo.push(t1);
    if (t2) tiposEquipo.push(t2);
  }

  if (tiposEquipo.length === 0) {
    document.getElementById('tabla-efectividad').innerHTML = "";
    return;
  }

  const eficaces = new Set();
  tiposEquipo.forEach(tipo => {
    if (efectividades[tipo]) {
      efectividades[tipo].forEach(t => eficaces.add(t));
    }
  });

  const cols = 6;
  let html = '<table class="table table-bordered">';
  for (let i = 0; i < tipos.length; i += cols) {
    html += '<tr>';
    for (let j = 0; j < cols; j++) {
      const idx = i + j;
      if (idx >= tipos.length) {
        html += '<td></td>';
        continue;
      }
      const t = tipos[idx];
      let simbolo = '';
      if (t != "") {
        simbolo = eficaces.has(t)
          ? `<span class="eficaz" title="Eficaz contra">▲▲▲</span>`
          : `<span class="no-eficaz" title="No eficaz">▼</span>`;
      }
      html += `<td>${t}<br>${simbolo}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';

  document.getElementById('tabla-efectividad').innerHTML = html;
}

function resetearSeleccion() {
    const selects = document.querySelectorAll('.select-tipo');
    selects.forEach(select => {
        select.value = "";
        localStorage.setItem(select.id, ""); // También se borra del almacenamiento
    });
    mostrarEfectividadTabla(); // Actualiza la tabla para reflejar los cambios
}

// Guardar selección en localStorage cuando cambie un select
document.querySelectorAll('.select-tipo').forEach(select => {
    select.addEventListener('change', () => {
        localStorage.setItem(select.id, select.value);
    });
});

function restaurarSeleccionDesdeStorage() {
    document.querySelectorAll('.select-tipo').forEach(select => {
        const valor = localStorage.getItem(select.id);
        if (valor !== null) {
            select.value = valor;
        }
    });
    mostrarEfectividadTabla();
}

restaurarSeleccionDesdeStorage();
