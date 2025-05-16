function guardarValores() {
    document.querySelectorAll("input, select").forEach(el => {
        localStorage.setItem(el.id, el.value);
    });
}

function cargarValores() {
    document.querySelectorAll("input, select").forEach(el => {
        const valor = localStorage.getItem(el.id);
        if (valor !== null) el.value = valor;
    });
    const naturaleza = localStorage.getItem("naturaleza");
    if (naturaleza) document.getElementById("naturaleza").value = naturaleza;
    actualizarNaturaleza();  // Asegurarse de actualizar la naturaleza al cargar los valores
    gestionarModoCalculo();
    sumarBases();
}

function actualizarNaturaleza() {
    const select = document.getElementById("naturaleza");
    const naturaleza = select.value;
    const [buff, nerf] = naturaleza.split("-");

    // Limpiar clases, etiquetas y valores de inputs hidden
    document.querySelectorAll("#stats-table tr").forEach(row => {
        row.classList.remove("buffed", "nerfed");
        const labelCell = row.querySelector(".naturaleza-label");
        if (labelCell) {
            let span = labelCell.querySelector("span");
            if (!span) {
                span = document.createElement("span");
                labelCell.prepend(span);
            }
            span.textContent = "";
            const hidden = labelCell.querySelector("input[type='hidden']");
            if (hidden) hidden.value = "1";
        }
    });

    // Aplicar efectos si no es naturaleza neutral
    if (buff !== "neutral") {
        document.querySelectorAll("#stats-table tr").forEach(row => {
            const stat = row.dataset.stat;
            const labelCell = row.querySelector(".naturaleza-label");
            const span = labelCell?.querySelector("span");
            const hidden = labelCell?.querySelector("input[type='hidden']");
            if (labelCell && span && hidden) {
                if (stat === buff) {
                    row.classList.add("buffed");
                    span.innerHTML = '<span style="color:green;" title="Estadística beneficiada">▲▲▲</span>';
                    hidden.value = "1.1";
                } else if (stat === nerf) {
                    row.classList.add("nerfed");
                    span.innerHTML = '<span style="color:red;" title="Estadística perjudicada">▼▼▼</span>';
                    hidden.value = "0.9";
                } else {
                    span.textContent = "";
                    hidden.value = "1";
                }
            }
        });
    } else {
        // Naturaleza neutral: guion y valor 1
        document.querySelectorAll(".naturaleza-label").forEach(cell => {
            let span = cell.querySelector("span");
            if (!span) {
                span = document.createElement("span");
                cell.prepend(span);
            }
            span.textContent = "-";
            const hidden = cell.querySelector("input[type='hidden']");
            if (hidden) hidden.value = "1";
        });
    }
}

// Guardar automáticamente al cambiar cualquier campo
document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", guardarValores);
});

// Inicializar al cargar la página
window.onload = () => {
    cargarValores();
    document.getElementById("nivel").dispatchEvent(new Event("input"));
};

// Gestionar el modo de cálculo (bloqueo de campos según la opción seleccionada)
function gestionarModoCalculo() {
    const modo = document.getElementById("calculo").value;

    document.querySelectorAll("#stats-table tr").forEach(row => {
        const stat = row.dataset.stat;
        if (!stat) return;

        const nivel = document.getElementById(`nivel-${stat}`);
        const base = document.getElementById(`base-${stat}`);
        const iv = document.getElementById(`iv-${stat}`);
        const ev = document.getElementById(`ev-${stat}`);

        // Por defecto, todos habilitados
        base.disabled = false;
        iv.disabled = false;
        ev.disabled = false;
        nivel.disabled = false;

        // Bloquear según el modo seleccionado
        if (modo === "base") {
            base.disabled = true;
        } else if (modo === "iv") {
            iv.disabled = true;
        } else if (modo === "nivel") {
            nivel.disabled = true;
        } else if (modo === "ev") {
            ev.disabled = true;
        }
    });
}

function calcularEstadisticas() {
    const modo = document.getElementById("calculo").value;
    const nivel = +document.getElementById("nivel").value;

    document.querySelectorAll("#stats-table tr").forEach(row => {
        const stat = row.dataset.stat;
        const statF = +document.getElementById(`nivel-${stat}`).value;
        const base = +document.getElementById(`base-${stat}`).value;
        const iv = +document.getElementById(`iv-${stat}`).value;
        const ev = +document.getElementById(`ev-${stat}`).value;
        const nat = +document.getElementById(`naturaleza-${stat}`)?.value || 1;

        let result = 0;

        if (stat === "Salud") {
            switch (modo) {
                case "nivel":
                    result = Math.round((((2 * base + iv + Math.floor(ev / 4)) * nivel) / 100) + nivel + 10);
                    document.getElementById(`nivel-${stat}`).value = Math.max(1, result);
                    break;
                case "base":
                    result = Math.round(((((statF - 10 - nivel) * 100) / nivel) - iv - Math.floor(ev / 4)) / 2);
                    document.getElementById(`base-${stat}`).value = Math.max(1, result);
                    break;
                case "iv":
                    result = Math.round((((statF - 10 - nivel) * 100) / nivel) - 2 * base - Math.floor(ev / 4));
                    document.getElementById(`iv-${stat}`).value = Math.max(0, result);
                    break;
                case "ev":
                    result = Math.round(((((statF - 10 - nivel) * 100) / nivel) - 2 * base - iv) * 4);
                    document.getElementById(`ev-${stat}`).value = Math.max(0, result);
                    break;
            }
            return;
        }

        switch (modo) {
            case "nivel":
                result = Math.round(((((2 * base + iv + Math.floor(ev / 4)) * nivel) / 100) + 5) * nat);
                document.getElementById(`nivel-${stat}`).value = Math.max(1, result);
                break;
            case "base":
                result = Math.round((((((statF / nat) - 5) * 100) / nivel) - iv - Math.floor(ev / 4)) / 2);
                document.getElementById(`base-${stat}`).value = Math.max(1, result);
                break;
            case "iv":
                result = Math.round((((((statF / nat) - 5) * 100) / nivel) - 2 * base - Math.floor(ev / 4)));
                document.getElementById(`iv-${stat}`).value = Math.max(0, result);
                break;
            case "ev":
                result = Math.round((((((statF / nat) - 5) * 100) / nivel) - 2 * base - iv) * 4);
                document.getElementById(`ev-${stat}`).value = Math.max(0, result);
                break;
        }
    });

    guardarValores();  // asegúrate de que esta función esté definida
    sumarBases();
}

function sumarBases() {
    const inputsBase = document.querySelectorAll('input[id^="base-"]');
    let suma = 0;

    inputsBase.forEach(input => {
        const valor = parseInt(input.value, 10);
        if (!isNaN(valor)) {
            suma += valor;
        }
    });

    document.getElementById('resultado-base').textContent = `(${suma})`;
}