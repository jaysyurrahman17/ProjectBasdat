document.addEventListener('DOMContentLoaded', function() {
  loadChapters();
});

function loadChapters() {
  const chapters = getData('chapters');
  const tableBody = document.querySelector('#chapterTable tbody');
  tableBody.innerHTML = '';
  
  if (chapters.length === 0) {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 3;
    cell.textContent = 'Belum ada chapter yang ditambahkan';
    cell.style.textAlign = 'center';
    return;
  }
  
  chapters.forEach((chapter, index) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><a href="students.html?chapterId=${chapter.id}">${chapter.name}</a></td>
      <td>
        <button class="btn btn-delete" onclick="deleteChapter('${chapter.id}')">Hapus</button>
      </td>
    `;
  });
}

function addChapter() {
  const chapterInput = document.getElementById('newChapter');
  const chapterName = chapterInput.value.trim();
  
  if (!chapterName) {
    showAlert('Nama chapter tidak boleh kosong', 'error');
    return;
  }
  
  const chapters = getData('chapters');
  const newChapter = {
    id: generateId(),
    name: chapterName
  };
  
  chapters.push(newChapter);
  saveData('chapters', chapters);
  
  chapterInput.value = '';
  loadChapters();
  showAlert('Chapter berhasil ditambahkan');
}

function deleteChapter(chapterId) {
  if (!confirm('Apakah Anda yakin ingin menghapus chapter ini?')) return;
  
  const chapters = getData('chapters');
  const updatedChapters = chapters.filter(chapter => chapter.id !== chapterId);
  
  saveData('chapters', updatedChapters);
  
  const students = getData('students');
  const updatedStudents = students.filter(student => student.chapterId !== chapterId);
  saveData('students', updatedStudents);
  
  const parameters = getData('parameters') || {};
  delete parameters[chapterId];
  saveData('parameters', parameters);
  
  const subaspects = getData('subaspects') || {};
  delete subaspects[chapterId];
  saveData('subaspects', subaspects);
  
  loadChapters();
  showAlert('Chapter berhasil dihapus');
}
