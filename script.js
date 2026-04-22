let datosCompletos = [];
const CONFIG_TURNOS = {
    "158": { desc: "08:00–14:00", color: "#E3F2FD", text: "#0D47A1" },
    "158/227": { desc: "08:00–14:00 / 15:00–21:00", color: "#1976D2", text: "#FFFFFF" },
    "V": { desc: "Vacaciones", color: "#FFF59D", text: "#827717" },
    "004": { desc: "Libre/Descanso", color: "#F5F5F5", text: "#757575" },
    "999": { desc: "Feriado", color: "#E0E0E0", text: "#424242" },
    "150": { desc: "Turno Especial", color: "#E1BEE7", text: "#4A148C" },
    "158/": { desc: "08:00–14:00", color: "#E3F2FD", text: "#0D47A1" }
};

// Carga el archivo datos.csv
fetch('datos.csv')
    .then(res => res.text())
    .then(content => {
        const filas = content.split(/\r?\n/);
        // Separamos por bloques de espacios (formato de tu archivo actual)
        datosCompletos = filas.filter(f => f.trim() !== "").map(f => {
            return f.trim().split(/\s{2,}/); 
        });
        console.log("Sistema cargado");
    });

function login() {
    const dniInput = document.getElementById('dniInput').value.trim();
    const passInput = document.getElementById('passInput').value.trim();

    // BUSQUEDA: Buscamos si el DNI existe en alguna fila
    const medico = datosCompletos.find(f => {
        return f.some(col => col.includes(dniInput));
    });

    // VALIDACIÓN: El DNI debe existir y la contraseña debe ser exactamente "123"
    if (medico && passInput === "123") {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('calendar-container').style.display = 'block';
        
        // Nombre (segunda columna detectada)
        document.getElementById('nombreMedico').innerText = medico[1] || "Médico";
        document.getElementById('zonaMedico').innerText = "Acceso con contraseña genérica";
        
        iniciarCalendario(medico);
    } else {
        alert("DNI no encontrado o contraseña incorrecta (Recuerde que es 123).");
    }
}

function iniciarCalendario(datosMedico) {
    const calendarEl = document.getElementById('calendar');
    const eventos = [];
    const anioMes = "2026-05-"; 

    let diaActual = 1;
    datosMedico.forEach(fragmento => {
        const posiblesCodigos = fragmento.split(/\s+/);
        posiblesCodigos.forEach(cod => {
            let c = cod.trim();
            if (CONFIG_TURNOS[c] && diaActual <= 31) {
                let fechaStr = anioMes + (diaActual < 10 ? '0' + diaActual : diaActual);
                eventos.push({
                    title: `${CONFIG_TURNOS[c].desc} (${c})`,
                    start: fechaStr,
                    backgroundColor: CONFIG_TURNOS[c].color,
                    textColor: CONFIG_TURNOS[c].text
                });
                diaActual++;
            }
        });
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: '2026-05-01',
        locale: 'es',
        events: eventos
    });
    calendar.render();
}
