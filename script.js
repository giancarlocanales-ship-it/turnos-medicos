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

// Cargar el archivo
fetch('datos.csv.csv') // Asegúrate que el nombre en GitHub sea exactamente este
    .then(res => res.text())
    .then(content => {
        const filas = content.split(/\r?\n/);
        // Esta línea es la clave: separa por cualquier cantidad de espacios
        datosCompletos = filas.filter(f => f.trim() !== "").map(f => f.trim().split(/\s{2,}/));
        console.log("Sistema cargado");
    });

function login() {
    const dniInput = document.getElementById('dniInput').value.trim();
    const passInput = document.getElementById('passInput').value.trim();

    // En tu archivo de espacios, el DNI es el cuarto elemento (índice 3)
    const medico = datosCompletos.find(f => f[3] && f[3].includes(dniInput));

    if (medico && dniInput === passInput) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('calendar-container').style.display = 'block';
        
        document.getElementById('nombreMedico').innerText = medico[1]; // Nombre
        document.getElementById('zonaMedico').innerText = "Zona: " + (medico[7] || "Asignada"); 
        
        iniciarCalendario(medico);
    } else {
        alert("DNI no encontrado o contraseña incorrecta.");
    }
}

function iniciarCalendario(datosMedico) {
    const calendarEl = document.getElementById('calendar');
    const eventos = [];
    const anioMes = "2026-05-"; 

    // Buscamos los turnos al final del array del médico
    // En tu archivo de texto, los turnos empiezan después de la zona
    let inicioTurnos = 9; 
    
    for (let i = inicioTurnos; i < datosMedico.length; i++) {
        let bloque = datosMedico[i].split(" "); // Algunos turnos vienen pegados por un solo espacio
        bloque.forEach((codigo, index) => {
            codigo = codigo.trim();
            if (codigo && CONFIG_TURNOS[codigo]) {
                let diaNum = eventos.length + 1;
                if (diaNum <= 31) {
                    let fechaStr = anioMes + (diaNum < 10 ? '0' + diaNum : diaNum);
                    eventos.push({
                        title: `${CONFIG_TURNOS[codigo].desc} (${codigo})`,
                        start: fechaStr,
                        backgroundColor: CONFIG_TURNOS[codigo].color,
                        textColor: CONFIG_TURNOS[codigo].text
                    });
                }
            }
        });
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'daygridMonth',
        initialDate: '2026-05-01',
        locale: 'es',
        events: eventos
    });
    calendar.render();
}
