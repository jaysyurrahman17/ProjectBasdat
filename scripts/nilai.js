let currentDetailStudentId = '';

document.addEventListener('DOMContentLoaded', function() {
  loadChaptersDropdown();
  loadAllStudentGrades();
});

function loadChaptersDropdown() {
  const chapters = getData('chapters');
  const dropdown = document.getElementById('chapterFilter');
  
  chapters.forEach(chapter => {
    const option = document.createElement('option');
    option.value = chapter.id;
    option.textContent = chapter.name;
    dropdown.appendChild(option);
  });
}

function filterStudents() {
  loadAllStudentGrades();
}

function calculateGrade(totalErrors) {
  const score = Math.max(0, 90 - totalErrors);
  
  let predikat = '';
  if (score >= 86) predikat = 'Istimewa';
  else if (score >= 78) predikat = 'Sangat Baik';
  else if (score >= 65) predikat = 'Baik';
  else if (score >= 50) predikat = 'Cukup';
  else predikat = 'Kurang';
  
  const status = score >= 65 ? 'Lulus' : 'Tidak Lulus';
  
  return { score, predikat, status };
}

function loadAllStudentGrades() {
  const students = getData('students');
  const chapters = getData('chapters');
  const evaluations = getData('evaluations') || {};
  const parameters = getData('parameters') || {};
  const subaspects = getData('subaspects') || {};
  
  const selectedChapterId = document.getElementById('chapterFilter').value;
  
  let filteredStudents = students;
  if (selectedChapterId) {
    filteredStudents = students.filter(student => student.chapterId === selectedChapterId);
  }
  
  const tableBody = document.querySelector('#nilaiTable tbody');
  tableBody.innerHTML = '';
  
  if (filteredStudents.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 9;
    cell.textContent = 'Tidak ada data mahasiswa';
    cell.style.textAlign = 'center';
    return;
  }
  
  filteredStudents.forEach((student, index) => {
    const chapter = chapters.find(c => c.id === student.chapterId);
    const studentEvaluations = evaluations[student.id] || {};
    
    let totalErrors = 0;
    for (const paramId in studentEvaluations) {
      totalErrors += studentEvaluations[paramId].totalErrors || 0;
    }
    
    const { score, predikat, status } = calculateGrade(totalErrors);
    
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.nrp}</td>
      <td>${chapter ? chapter.name : '-'}</td>
      <td>${totalErrors}</td>
      <td>${score}</td>
      <td>${predikat}</td>
      <td>${status}</td>
      <td>
        <button onclick="showStudentDetail('${student.id}')">Detail</button>
      </td>
    `;
  });
}

function showStudentDetail(studentId) {
  currentDetailStudentId = studentId;
  
  const students = getData('students');
  const student = students.find(s => s.id === studentId);
  
  if (!student) return;
  
  document.getElementById('studentDetailName').textContent = `${student.name} (${student.nrp})`;
  
  const parameters = getData('parameters') || {};
  const evaluations = getData('evaluations') || {};
  const studentParameters = parameters[studentId] || [];
  const studentEvaluations = evaluations[studentId] || {};
  
  const tableBody = document.querySelector('#parameterTable tbody');
  tableBody.innerHTML = '';
  
  let totalErrors = 0;
  
  studentParameters.forEach(parameter => {
    const paramEvaluation = studentEvaluations[parameter.id] || { totalErrors: 0 };
    totalErrors += paramEvaluation.totalErrors;
    
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${parameter.name}</td>
      <td>${paramEvaluation.totalErrors || 0}</td>
    `;
  });
  
  document.getElementById('totalDetailErrors').textContent = totalErrors;
  document.getElementById('totalDeduction').textContent = totalErrors;
  
  const { score, predikat, status } = calculateGrade(totalErrors);
  document.getElementById('finalGrade').textContent = score;
  document.getElementById('predikat').textContent = predikat;
  document.getElementById('status').textContent = status;
  
  const feedbacks = getData('feedbacks') || {};
  const studentFeedback = feedbacks[studentId] || { comments: '' };
  document.getElementById('catatanPenguji').value = studentFeedback.comments || '';
  
  document.getElementById('detailNilai').style.display = 'block';
  
  document.getElementById('detailNilai').scrollIntoView({ behavior: 'smooth' });
}

function saveFeedback() {
  if (!currentDetailStudentId) return;
  
  const comments = document.getElementById('catatanPenguji').value.trim();
  
  const feedbacks = getData('feedbacks') || {};
  feedbacks[currentDetailStudentId] = {
    comments: comments,
    timestamp: new Date().toISOString()
  };
  
  saveData('feedbacks', feedbacks);
  showAlert('Catatan berhasil disimpan');
}
