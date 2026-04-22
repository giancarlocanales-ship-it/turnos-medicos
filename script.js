let datosCompletos = [];
const CONFIG_TURNOS = {
    "158": { desc: "08:00–14:00", color: "#E3F2FD", text: "#0D47A1" },
    "V": { desc: "Vacaciones", color: "#FFF59D", text: "#827717" },
    "004": { desc: "Libre/Descanso", color: "#F5F5F5", text: "#757575" },
    "999": { desc: "Feriado", color: "#E0E0E0", text: "#424242" }
};

// Cargar el CSV al abrir la página
fetch('datos.csv')
    .then(res => res.text())
    .then(content => {
        const filas = content.split('\n');
        const headers = filas[0].split(',');
        datosCompletos = filas.slice(1).map(f => f.split(','));
    });

function login() {
    const dni = document.getElementById('dniInput').value;
    const pass = document.getElementById('passInput').value;

    const medico = datosCompletos.find(f => f[4] === dni); // Asumiendo DNI en columna 5 (índice 4)

    if (medico && dni === pass) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('calendar-container').style.display = 'block';
        document.getElementById('nombreMedico').innerText = medico[1]; // Nombre en columna 2
        document.getElementById('zonaMedico').innerText = "Zona: " + medico[3]; // Zona en columna 4
        iniciarCalendario(medico);
    } else {
        alert("DNI o contraseña incorrectos");
    }
}

function iniciarCalendario(datosMedico) {
    const calendarEl = document.getElementById('calendar');
    const eventos = [];

    // Mapear turnos (Asumiendo que los turnos empiezan en la columna 14 del Excel)
    // Ajusta el '14' según tu archivo real
    for (let i = 14; i < datosMedico.length; i++) {
        let codigo = datosMedico[i]?.trim();
        if (codigo && CONFIG_TURNOS[codigo]) {
            // Aquí se necesitaría la lógica de fechas del encabezado del CSV
            // Simplificado para ejemplo:
            eventos.push({
                title: `${CONFIG_TURNOS[codigo].desc} (${codigo})`,
                start: `2026-05-${i-13 < 10 ? '0'+(i-13) : i-13}`, // Ajustar según mes actual
                backgroundColor: CONFIG_TURNOS[codigo].color,
                textColor: CONFIG_TURNOS[codigo].text
            });
        }
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        events: eventos
    });
    calendar.render();
}