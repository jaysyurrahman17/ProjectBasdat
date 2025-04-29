let currentChapterId = '';
let currentStudentId = '';
let currentParameterId = '';

document.addEventListener('DOMContentLoaded', function() {
  currentChapterId = getUrlParam('chapterId');
  currentStudentId = getUrlParam('studentId');
  currentParameterId = getUrlParam('parameterId');
  
  if (!currentChapterId || !currentStudentId || !currentParameterId) {
    window.location.href = 'chapters.html';
    return;
  }
  
  document.getElementById('backToParameters').href = `parameters.html?chapterId=${currentChapterId}&studentId=${currentStudentId}`;
  
  loadInfo();
  loadSubaspects();
});

function loadInfo() {
  const chapters = getData('chapters');
  const students = getData('students');
  const parameters = getData('parameters') || {};
  
  const chapter = chapters.find(c => c.id === currentChapterId);
  const student = students.find(s => s.id === currentStudentId);
  const studentParameters = parameters[currentStudentId] || [];
  const parameter = studentParameters.find(p => p.id === currentParameterId);
  
  if (!chapter || !student || !parameter) {
    window.location.href = 'chapters.html';
    return;
  }
  
  document.getElementById('chapterName').textContent = chapter.name;
  document.getElementById('studentName').textContent = student.name;
  document.getElementById('studentNrp').textContent = student.nrp;
  document.getElementById('parameterName').textContent = parameter.name;
  
  document.title = `Sub-Aspek: ${parameter.name} - Web Penilaian Mahasiswa`;
}

function loadSubaspects() {
  const allSubaspects = getData('subaspects') || {};
  const parameterSubaspects = allSubaspects[currentParameterId] || [];
  
  const tableBody = document.querySelector('#subaspectTable tbody');
  tableBody.innerHTML = '';
  
  if (parameterSubaspects.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 4;
    cell.textContent = 'Belum ada sub-aspek yang ditambahkan';
    cell.style.textAlign = 'center';
    return;
  }
  
  parameterSubaspects.forEach((subaspect, index) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${subaspect.name}</td>
      <td>
        <input type="number" min="0" value="${subaspect.errors}" 
               onchange="updateErrors('${subaspect.id}', this.value)">
      </td>
      <td>
        <button class="btn btn-delete" onclick="deleteSubaspect('${subaspect.id}')">Hapus</button>
      </td>
    `;
  });
  
  updateTotalErrors();
}

function addSubaspect() {
  const subaspectInput = document.getElementById('subaspectName');
  const subaspectName = subaspectInput.value.trim();
  
  if (!subaspectName) {
    showAlert('Nama sub-aspek tidak boleh kosong', 'error');
    return;
  }
  
  const allSubaspects = getData('subaspects') || {};
  const parameterSubaspects = allSubaspects[currentParameterId] || [];
  
  const newSubaspect = {
    id: generateId(),
    name: subaspectName,
    errors: 0
  };
  
  parameterSubaspects.push(newSubaspect);
  allSubaspects[currentParameterId] = parameterSubaspects;
  
  saveData('subaspects', allSubaspects);
  
  subaspectInput.value = '';
  loadSubaspects();
  showAlert('Sub-aspek berhasil ditambahkan');
}

function updateErrors(subaspectId, value) {
  const errorCount = parseInt(value) || 0;
  
  const allSubaspects = getData('subaspects') || {};
  const parameterSubaspects = allSubaspects[currentParameterId] || [];
  
  const subaspectIndex = parameterSubaspects.findIndex(s => s.id === subaspectId);
  if (subaspectIndex !== -1) {
    parameterSubaspects[subaspectIndex].errors = errorCount;
    allSubaspects[currentParameterId] = parameterSubaspects;
    saveData('subaspects', allSubaspects);
  }
  
  updateTotalErrors();
}

function deleteSubaspect(subaspectId) {
  if (!confirm('Apakah Anda yakin ingin menghapus sub-aspek ini?')) return;
  
  const allSubaspects = getData('subaspects') || {};
  const parameterSubaspects = allSubaspects[currentParameterId] || [];
  
  allSubaspects[currentParameterId] = parameterSubaspects.filter(s => s.id !== subaspectId);
  saveData('subaspects', allSubaspects);
  
  loadSubaspects();
  showAlert('Sub-aspek berhasil dihapus');
}

function updateTotalErrors() {
  const allSubaspects = getData('subaspects') || {};
  const parameterSubaspects = allSubaspects[currentParameterId] || [];
  
  const total = parameterSubaspects.reduce((sum, subaspect) => sum + (subaspect.errors || 0), 0);
  document.getElementById('totalErrors').textContent = total;
}

function saveEvaluation() {
  const allSubaspects = getData('subaspects') || {};
  const parameterSubaspects = allSubaspects[currentParameterId] || [];
  
  const totalErrors = parameterSubaspects.reduce((sum, subaspect) => sum + (subaspect.errors || 0), 0);
  
  const allEvaluations = getData('evaluations') || {};
  const studentEvaluations = allEvaluations[currentStudentId] || {};
  
  studentEvaluations[currentParameterId] = {
    parameterId: currentParameterId,
    totalErrors: totalErrors,
    timestamp: new Date().toISOString()
  };
  
  allEvaluations[currentStudentId] = studentEvaluations;
  saveData('evaluations', allEvaluations);
  
  showAlert('Penilaian berhasil disimpan');
}
