const tipos = ["Simple", "Fire", "Water", "Plant", "Light",
   "Dark", "Ice","Electric", "Air", "Bug",
    "Earth", "Toxic", "Metal", "Ancient", "Spirit",
     "Brawler", "Mind"];

const selects = document.querySelectorAll('.select-tipo');

selects.forEach((select, i) => {
  const isTipo1 = i % 2 === 0;
  const label = 'Ninguno';
  select.innerHTML = `<option value="">${label}</option>` + 
    tipos.map(t => `<option value="${t}">${t}</option>`).join('');
  select.addEventListener('change', mostrarEfectividadTabla);
});

const efectividades = {
  Fire: ["Plant", "Dark", "Ice", "Metal"],
  Water: ["Fire", "Electric", "Earth"],
  Plant: ["Water", "Earth"],
  Light: ["Dark", "Ancient", "Spirit"],
  Dark: ["Plant", "Light", "Mind"],
  Ice: ["Plant", "Air", "Bug", "Earth"],
  Electric: ["Water", "Air", "Metal"],
  Air: ["Fire", "Bug", "Brawler"],
  Bug: ["Plant", "Dark", "Mind"],
  Earth: ["Fire", "Electric", "Toxic", "Metal"],
  Toxic: ["Water", "Plant", "Brawler"],
  Metal: ["Light", "Ice", "Ancient"],
  Ancient: ["Ancient", "Spirit"],
  Spirit: ["Spirit", "Brawler", "Mind"],
  Brawler: ["Simple", "Ice", "Bug", "Metal"],
  Mind: ["Simple", "Toxic", "Brawler"],
  // Puedes completar más tipos y sus efectividades
};

function mostrarEfectividadTabla() {
  const tiposEquipo = [];

  for (let i = 1; i <= 6; i++) {
    const t1 = document.getElementById(`tipo1_loomian${i}`).value;
    const t2 = document.getElementById(`tipo2_loomian${i}`).value;
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

  const cols = 5;
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
