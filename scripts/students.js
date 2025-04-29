let currentChapterId = '';

document.addEventListener('DOMContentLoaded', function() {
  currentChapterId = getUrlParam('chapterId');
  
  if (!currentChapterId) {
    window.location.href = 'chapters.html';
    return;
  }
  
  loadChapterName();
  loadStudents();
});

function loadChapterName() {
  const chapters = getData('chapters');
  const chapter = chapters.find(c => c.id === currentChapterId);
  
  if (chapter) {
    document.getElementById('chapterName').textContent = chapter.name;
    document.title = `Mahasiswa: ${chapter.name} - Web Penilaian Mahasiswa`;
  } else {
    window.location.href = 'chapters.html';
  }
}

function loadStudents() {
  const allStudents = getData('students') || [];
  const students = allStudents.filter(student => student.chapterId === currentChapterId);
  
  const tableBody = document.querySelector('#studentTable tbody');
  tableBody.innerHTML = '';
  
  if (students.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 4;
    cell.textContent = 'Belum ada mahasiswa yang ditambahkan';
    cell.style.textAlign = 'center';
    return;
  }
  
  students.forEach((student, index) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><a href="parameters.html?chapterId=${currentChapterId}&studentId=${student.id}">${student.name}</a></td>
      <td>${student.nrp}</td>
      <td>
        <button class="btn btn-delete" onclick="deleteStudent('${student.id}')">Hapus</button>
      </td>
    `;
  });
}

function addStudent() {
  const nameInput = document.getElementById('namaMahasiswa');
  const nrpInput = document.getElementById('nrpMahasiswa');
  
  const name = nameInput.value.trim();
  const nrp = nrpInput.value.trim();
  
  if (!name || !nrp) {
    showAlert('Nama dan NRP tidak boleh kosong', 'error');
    return;
  }
  
  const students = getData('students') || [];
  
  if (students.some(s => s.chapterId === currentChapterId && s.nrp === nrp)) {
    showAlert('NRP sudah terdaftar untuk chapter ini', 'error');
    return;
  }
  
  const newStudent = {
    id: generateId(),
    chapterId: currentChapterId,
    name: name,
    nrp: nrp
  };
  
  students.push(newStudent);
  saveData('students', students);
  
  nameInput.value = '';
  nrpInput.value = '';
  
  loadStudents();
  showAlert('Mahasiswa berhasil ditambahkan');
}

function deleteStudent(studentId) {
  if (!confirm('Apakah Anda yakin ingin menghapus mahasiswa ini?')) return;
  
  const students = getData('students');
  const updatedStudents = students.filter(student => student.id !== studentId);
  
  saveData('students', updatedStudents);
  
  const evaluations = getData('evaluations') || {};
  delete evaluations[studentId];
  saveData('evaluations', evaluations);
  
  loadStudents();
  showAlert('Mahasiswa berhasil dihapus');
}
