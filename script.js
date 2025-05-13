const students=[]

document.getElementById("studentForm").addEventListener("submit",function(e){
 e.preventDefault();

 const name=document.getElementById("name").value.trim();
 const lastName=document.getElementById("lastName").value.trim();
 const grade=parseFloat(document.getElementById("grade").value)

 if(grade<1 || grade>7 ||!name || !lastName || isNaN(grade)){
    alert("Error sl ingresar los datos")
    return
 }

 const student={name,lastName,grade}
 students.push(student)
 //console.log(students) 
addStudentToTable(student);
 this.reset()

});
const tableBody=document.querySelector("#studentsTable tbody");
function addStudentToTable(student){
    const row= document.createElement("tr");
    row.innerHTML=`
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${student.grade}</td>
    `;
 tableBody.appendChild(row);
 addPromedio();
}
// 13 de mayo
const promedioDiv = document.getElementById("promedio");
function addPromedio() {
   const notas = document.querySelectorAll("#studentsTable tbody tr td:nth-child(3)");

   let suma=0;
   let cantidad=0;

   notas.forEach(function(nota) {
      suma += parseFloat(nota.textContent); 
      cantidad++;
    });

   const promedio = suma / cantidad 

  promedioDiv.textContent = `Promedio: ${promedio.toFixed(2)}`;
  calcularPromedio();
}; 
 