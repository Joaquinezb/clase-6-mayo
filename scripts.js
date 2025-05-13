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
}