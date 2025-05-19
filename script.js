const students = [];

document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);
    const fecha = document.getElementById("fecha").value.trim();

    // Limpia errores previos
    ['nameError', 'lastNameError', 'gradeError', 'fechaError'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = '';
        el.classList.remove('active');
    });

    let valid = true;

    // Validar nombre
    if (name === '') {
        const el = document.getElementById('nameError');
        el.innerHTML = '<span class="icon-alert">!</span> El nombre es obligatorio.';
        el.classList.add('active');
        valid = false;
    }

    // Validar apellido
    if (lastName === '') {
        const el = document.getElementById('lastNameError');
        el.innerHTML = '<span class="icon-alert">!</span> El apellido es obligatorio.';
        el.classList.add('active');
        valid = false;
    }

    // Validar nota
    if (isNaN(grade) || grade < 1 || grade > 7) {
        const el = document.getElementById('gradeError');
        el.innerHTML = '<span class="icon-alert">!</span> La nota debe ser un número entre 1 y 7';
        el.classList.add('active');
        valid = false;
    }

    // Validar fecha
    const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!fechaRegex.test(fecha)) {
        const el = document.getElementById('fechaError');
        el.innerHTML = '<span class="icon-alert">!</span> ingrese una Fecha valida (DD/MM/AAAA).';
        el.classList.add('active');
        valid = false;
    }

    if (!valid) return;

    const student = { name, lastName, grade, fecha };
    students.push(student);
    addStudentToTable(student);
    this.reset();
});

const tableBody = document.querySelector("#studentsTable tbody");

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade}</td>
        <td>${student.fecha}</td>
    `;
    tableBody.appendChild(row);
    addPromedio();
}

const promedioDiv = document.getElementById("promedio");

function addPromedio() {
    const notas = document.querySelectorAll("#studentsTable tbody tr td:nth-child(3)");
    let suma = 0;
    let cantidad = 0;

    notas.forEach(function (nota) {
        suma += parseFloat(nota.textContent);
        cantidad++;
    });

    const promedio = cantidad > 0 ? suma / cantidad : 0;
    promedioDiv.textContent = cantidad > 0 ? `Promedio: ${promedio.toFixed(1)}` : '';
}

["name", "lastName", "grade", "fecha"].forEach(function(id) {
    document.getElementById(id).addEventListener("input", function() {
        const errorId = id + "Error";
        const el = document.getElementById(errorId);
        // Para grade, también valida el rango
        if (id === "grade") {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 1 && value <= 7) {
                el.textContent = "";
                el.classList.remove("active");
            }
        } else if (id === "fecha") {
            // Para fecha, valida el formato
            const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            if (fechaRegex.test(this.value.trim())) {
                el.textContent = "";
                el.classList.remove("active");
            }
        } else {
            // Para name y lastName, solo verifica que no esté vacío
            if (this.value.trim() !== "") {
                el.textContent = "";
                el.classList.remove("active");
            }
        }
    });
});
