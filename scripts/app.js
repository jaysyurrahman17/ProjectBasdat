function initializeStorage() {
  if (!localStorage.getItem('appData')) {
    const initialData = {
      chapters: [],
      students: [],
      parameters: {},
      subaspects: {},
      evaluations: {}
    };
    localStorage.setItem('appData', JSON.stringify(initialData));
  }
}

function getAllData() {
  return JSON.parse(localStorage.getItem('appData') || '{}');
}

function saveAllData(data) {
  localStorage.setItem('appData', JSON.stringify(data));
}

function getData(collection) {
  const data = getAllData();
  return data[collection] || [];
}

function saveData(collection, newData) {
  const data = getAllData();
  data[collection] = newData;
  saveAllData(data);
}

function showAlert(message, type = 'success') {
  const alertBox = document.getElementById('alert');
  if (alertBox) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
    
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 3000);
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

initializeStorage();
