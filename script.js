let datosCompletos = [];
const CONFIG_TURNOS = {
    "158": { desc: "08:00–14:00", color: "#E3F2FD", text: "#0D47A1" },
    "158/227": { desc: "08:00–14:00 / 15:00–21:00", color: "#1976D2", text: "#FFFFFF" },
    "V": { desc: "Vacaciones", color: "#FFF59D", text: "#827717" },
    "004": { desc: "Libre/Descanso", color: "#F5F5F5", text: "#757575" },
    "999": { desc: "Feriado", color: "#E0E0E0", text: "#424242" },
    "150": { desc: "Turno Especial", color: "#E1BEE7", text: "#4A148C" }
};

// 1. CARGA DEL ARCHIVO: Usamos 'datos.csv' que es tu nombre actual
fetch('datos.csv')
    .then(res => res.text())
    .then(content => {
        const filas = content.split(/\r?\n/);
        // Filtramos filas vacías y separamos por bloques de 2 o más espacios
        datosCompletos = filas.filter(f => f.trim() !== "").map(f => {
            return f.trim().split(/\s{2,}/); 
        });
        console.log("Sistema listo");
    });

function login() {
    const dniInput = document.getElementById('dniInput').value.trim();
    const passInput = document.getElementById('passInput').value.trim();

    // 2. BUSQUEDA INTELIGENTE: Busca el DNI en cualquier parte de la fila
    const medico = datosCompletos.find(f => {
        return f.some(col => col.includes(dniInput));
    });

    if (medico && dniInput === passInput) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('calendar-container').style.display = 'block';
        
        // Asignamos nombre (suele ser la 2da columna detectada)
        document.getElementById('nombreMedico').innerText = medico[1] || "Médico Verificado";
        document.getElementById('zonaMedico').innerText = "Acceso Correcto";
        
        iniciarCalendario(medico);
    } else {
        alert("DNI no encontrado o contraseña incorrecta.");
    }
}

function iniciarCalendario(datosMedico) {
    const calendarEl = document.getElementById('calendar');
    const eventos = [];
    const anioMes = "2026-05-"; 

    // 3. DETECCION DE TURNOS: Busca códigos válidos en toda la fila
    let diaActual = 1;
    datosMedico.forEach(fragmento => {
        // Separamos por espacios simples por si hay códigos pegados
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
