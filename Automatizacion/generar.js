function transformarNumero(n, valor) {
    if (valor === 1 || valor === 3 * n + 2) return null;

    if (valor >= 2 && valor <= n + 1) {
        return valor - 1;
    } else if (valor >= n + 2 && valor <= 2 * n + 1) {
        return valor - (n + 1);
    } else if (valor >= 2 * n + 2 && valor <= 3 * n + 1) {
        return valor - (2 * n + 1);
    }

    return null;
}
function generar() {
    const n = parseInt(document.getElementById('inputNumero').value);
    if (isNaN(n) || n <= 1) {
        document.getElementById('resultado').innerText = "Por favor, ingresa un número válido mayor que 1.";
        return;
    }
    
    let aleatorio, transformado;
    do {
        aleatorio = Math.floor(Math.random() * (3 * n + 2)) + 1;
        transformado = transformarNumero(n, aleatorio);
    } while (transformado === null);
    
    document.getElementById('resultado').innerText = `Número generado: ${aleatorio} → Transformado: ${transformado}`;
}