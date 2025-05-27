// Array para almacenar los estudiantes
const students = [];
// Índice para saber si estamos editando un estudiante existente
let editIndex = null;

// Evento para manejar el envío del formulario
document.getElementById("studentForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Obtiene los valores de los campos del formulario
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);
    const fecha = document.getElementById("fecha").value.trim();

    // Limpia los mensajes de error previos
    ['nameError', 'lastNameError', 'gradeError', 'fechaError'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = '';
        el.classList.remove('active');
    });

    let valid = true;

    // Validación del nombre
    if (name === '') {
        const el = document.getElementById('nameError');
        el.innerHTML = '<span class="icon-alert">!</span> El nombre es obligatorio.';
        el.classList.add('active');
        valid = false;
    }

    // Validación del apellido
    if (lastName === '') {
        const el = document.getElementById('lastNameError');
        el.innerHTML = '<span class="icon-alert">!</span> El apellido es obligatorio.';
        el.classList.add('active');
        valid = false;
    }

    // Validación de la nota
    if (isNaN(grade) || grade < 1 || grade > 7) {
        const el = document.getElementById('gradeError');
        el.innerHTML = '<span class="icon-alert">!</span> La nota debe ser un número entre 1 y 7';
        el.classList.add('active');
        valid = false;
    }

    // Validación de la fecha (formato DD/MM/AAAA)
    const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!fechaRegex.test(fecha)) {
        const el = document.getElementById('fechaError');
        el.innerHTML = '<span class="icon-alert">!</span> ingrese una Fecha valida (DD/MM/AAAA).';
        el.classList.add('active');
        valid = false;
    }

    if (!valid) return; // Si hay errores, no continúa

    // Si estamos editando, actualiza el estudiante existente
    if (editIndex !== null) {
        students[editIndex] = { name, lastName, grade, fecha };
        updateStudentRow(editIndex); // Actualiza la fila en la tabla
        editIndex = null; // Sale del modo edición
        this.querySelector('button[type="submit"]').textContent = "Guardar"; // Cambia el texto del botón
    } else {
        // Si no, agrega un nuevo estudiante
        const student = { name, lastName, grade, fecha };
        students.push(student);
        addStudentToTable(student); // Agrega la fila a la tabla
    }
    this.reset(); // Limpia el formulario
});

// Referencia al cuerpo de la tabla
const tableBody = document.querySelector("#studentsTable tbody");

// Función para agregar un estudiante a la tabla
function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade}</td>
        <td>${student.fecha}</td>
        <td>
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        </td>
    `;
    tableBody.appendChild(row);

    // Asigna el evento al botón eliminar
    row.querySelector(".delete-btn").addEventListener("click", function () {
        borrarEstudiante(student, row);
    });

    // Asigna el evento al botón editar
    row.querySelector(".edit-btn").addEventListener("click", function () {
        editarEstudiante(student, row);
    });

    addPromedio(); // Actualiza el promedio
}

// Función para actualizar una fila de la tabla después de editar
function updateStudentRow(index) {
    const rows = tableBody.querySelectorAll("tr");
    const student = students[index];
    if (rows[index]) {
        // Actualiza los datos de la fila
        rows[index].children[0].textContent = student.name;
        rows[index].children[1].textContent = student.lastName;
        rows[index].children[2].textContent = student.grade;
        rows[index].children[3].textContent = student.fecha;

        // Vuelve a poner los botones y sus eventos
        rows[index].children[4].innerHTML = `
            <button class="delete-btn">Eliminar</button>
            <button class="edit-btn">Editar</button>
        `;
        // Evento eliminar
        rows[index].querySelector(".delete-btn").addEventListener("click", function () {
            borrarEstudiante(student, rows[index]);
        });
        // Evento editar
        rows[index].querySelector(".edit-btn").addEventListener("click", function () {
            editarEstudiante(student, rows[index]);
        });
    }
    addPromedio(); // Actualiza el promedio
}

// Referencia al div donde se muestra el promedio
const promedioDiv = document.getElementById("promedio");

// Función para calcular y mostrar el promedio de notas
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

// Función para eliminar un estudiante de la tabla y del array
function borrarEstudiante(student, row) {
    // Busca el índice del estudiante en el array
    const index = students.indexOf(student);

    // Si lo encuentra, lo elimina del array y de la tabla
    if (index > -1) {
        students.splice(index, 1); // Elimina del array
        row.remove(); // Elimina la fila de la tabla
        addPromedio(); // Recalcula el promedio
    }
}

// Función para cargar los datos del estudiante en el formulario para editar
function editarEstudiante(student, row) {
    // Obtiene el índice real de la fila
    const index = Array.from(tableBody.children).indexOf(row);
    const currentStudent = students[index];

    // Rellena el formulario con los datos actuales del array
    document.getElementById("name").value = currentStudent.name;
    document.getElementById("lastName").value = currentStudent.lastName;
    document.getElementById("grade").value = currentStudent.grade;
    document.getElementById("fecha").value = currentStudent.fecha;

    // Guarda el índice del estudiante a editar
    editIndex = index;

    // Cambia el texto del botón a "Actualizar"
    document.querySelector('#studentForm button[type="submit"]').textContent = "Actualizar";
}

// Validación en tiempo real de los campos del formulario
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

// textContent recomendado cambiar por innerHTML
