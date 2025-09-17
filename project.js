const input = document.getElementById('username');

input.addEventListener('input', () => {
  if (input.value.trim() !== '') {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
});