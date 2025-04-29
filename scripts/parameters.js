let currentChapterId = '';
let currentStudentId = '';

document.addEventListener('DOMContentLoaded', function() {
  currentChapterId = getUrlParam('chapterId');
  currentStudentId = getUrlParam('studentId');
  
  if (!currentChapterId || !currentStudentId) {
    window.location.href = 'chapters.html';
    return;
  }
  
  document.getElementById('backToStudents').href = `students.html?chapterId=${currentChapterId}`;
  
  loadChapterAndStudentInfo();
  loadParameters();
});

function loadChapterAndStudentInfo() {
  const chapters = getData('chapters');
  const students = getData('students');
  
  const chapter = chapters.find(c => c.id === currentChapterId);
  const student = students.find(s => s.id === currentStudentId);
  
  if (!chapter || !student) {
    window.location.href = 'chapters.html';
    return;
  }
  
  document.getElementById('chapterName').textContent = chapter.name;
  document.getElementById('studentName').textContent = student.name;
  document.getElementById('studentNrp').textContent = student.nrp;
  
  document.title = `Parameter: ${student.name} - Web Penilaian Mahasiswa`;
}

function loadParameters() {
  const parameters = getData('parameters') || {};
  const studentParameters = parameters[currentStudentId] || [];
  
  const tableBody = document.querySelector('#parameterTable tbody');
  tableBody.innerHTML = '';
  
  if (studentParameters.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 3;
    cell.textContent = 'Belum ada parameter yang ditambahkan';
    cell.style.textAlign = 'center';
    return;
  }
  
  studentParameters.forEach((parameter, index) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><a href="subaspects.html?chapterId=${currentChapterId}&studentId=${currentStudentId}&parameterId=${parameter.id}">${parameter.name}</a></td>
      <td>
        <button class="btn btn-delete" onclick="deleteParameter('${parameter.id}')">Hapus</button>
      </td>
    `;
  });
}

function addParameter() {
  const parameterInput = document.getElementById('parameterName');
  const parameterName = parameterInput.value.trim();
  
  if (!parameterName) {
    showAlert('Nama parameter tidak boleh kosong', 'error');
    return;
  }
  
  const allParameters = getData('parameters') || {};
  const studentParameters = allParameters[currentStudentId] || [];
  
  const newParameter = {
    id: generateId(),
    name: parameterName
  };
  
  studentParameters.push(newParameter);
  allParameters[currentStudentId] = studentParameters;
  
  saveData('parameters', allParameters);
  
  parameterInput.value = '';
  loadParameters();
  showAlert('Parameter berhasil ditambahkan');
}

function deleteParameter(parameterId) {
  if (!confirm('Apakah Anda yakin ingin menghapus parameter ini?')) return;
  
  const allParameters = getData('parameters') || {};
  const studentParameters = allParameters[currentStudentId] || [];
  
  allParameters[currentStudentId] = studentParameters.filter(p => p.id !== parameterId);
  saveData('parameters', allParameters);
  
  const allSubaspects = getData('subaspects') || {};
  delete allSubaspects[parameterId];
  saveData('subaspects', allSubaspects);
  
  loadParameters();
  showAlert('Parameter berhasil dihapus');
}
