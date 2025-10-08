
const form = document.getElementById('registrationForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const errorDiv = document.getElementById('passwordError');


form.addEventListener('submit', (event) => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                errorDiv.textContent = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน';
                event.preventDefault(); 
            } else {
                errorDiv.textContent = '';
            }
        });
  