let datosCompletos = [];
const CONFIG_TURNOS = {
    "158": { desc: "08:00–14:00", color: "#E3F2FD", text: "#0D47A1" },
    "158/227": { desc: "08:00–14:00 / 15:00–21:00", color: "#1976D2", text: "#FFFFFF" },
    "V": { desc: "Vacaciones", color: "#FFF59D", text: "#827717" },
    "004": { desc: "Libre/Descanso", color: "#F5F5F5", text: "#757575" },
    "999": { desc: "Feriado", color: "#E0E0E0", text: "#424242" }
};

fetch('datos.csv')
    .then(res => res.text())
    .then(content => {
        const filas = content.split(/\r?\n/);
        datosCompletos = filas.filter(f => f.trim() !== "").map(f => f.split(','));
    });

function login() {
    const user = document.getElementById('dniInput').value.trim();
    const pass = document.getElementById('passInput').value.trim();

    // LOGIN: Si es 123/123 o si el DNI existe y la clave es 123
    const medico = datosCompletos.find(f => f[2] === user || f[0] === user);

    if (medico && pass === "123") {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('calendar-container').style.display = 'block';
        document.getElementById('nombreMedico').innerText = "Médico: " + medico[1];
        iniciarCalendario(medico);
    } else {
        alert("Acceso denegado. Use Usuario: 123 | Clave: 123");
    }
}

function iniciarCalendario(datosMedico) {
    const eventos = [];
    const anioMes = "2026-05-"; 
    
    // Los turnos en el nuevo CSV empiezan en la columna índice 4 (01 de mayo)
    for (let i = 4; i < datosMedico.length; i++) {
        let codigo = datosMedico[i].trim();
        if (CONFIG_TURNOS[codigo]) {
            let diaNum = i - 3;
            let fechaStr = anioMes + (diaNum < 10 ? '0' + diaNum : diaNum);
            eventos.push({
                title: CONFIG_TURNOS[codigo].desc,
                start: fechaStr,
                backgroundColor: CONFIG_TURNOS[codigo].color,
                textColor: CONFIG_TURNOS[codigo].text,
                allDay: true
            });
        }
    }

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: '2026-05-01',
        locale: 'es',
        events: eventos
    });
    calendar.render();
}
