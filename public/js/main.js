
document.addEventListener('DOMContentLoaded', function() {
    // === Form Validation ===
    const form = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const errorDiv = document.getElementById('passwordError');

    // ตรวจสอบว่าหา element เจอหรือไม่
    if (form && passwordInput && confirmPasswordInput && errorDiv) {
        form.addEventListener('submit', (event) => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                errorDiv.textContent = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน';
                errorDiv.style.color = 'red'; // เพิ่มสีแดงให้เห็นชัด
                event.preventDefault(); 
            } else {
                errorDiv.textContent = '';
            }
        });
    }
});
  


document.addEventListener('DOMContentLoaded', function() {
            const openBtn = document.getElementById('openModal');
            const closeBtn = document.getElementById('closeModal');
            const modal = document.getElementById('modal');

            // เปิด Modal
            openBtn.addEventListener('click', () => {
                
                modal.classList.add('open');
            });

            // ปิด Modal
            closeBtn.addEventListener('click', () => {
                
                modal.classList.remove('open');
            });

            // ปิดเมื่อคลิกพื้นหลังดำ (เพิ่มเติม)
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                }
            });

            // ปิดด้วยปุ่ม ESC (เพิ่มเติม)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('open')) {
                    modal.classList.remove('open');
                }
            });
});



window.openProblemDetail = function(problemData) {
    const modalElement = document.getElementById('problemDetailModal');
    
    // เช็คว่า Modal มีอยู่จริง
    if (!modalElement) {
        console.error('ไม่พบ Modal element');
        return;
    }
    
    const modal = new bootstrap.Modal(modalElement);
    
    // อัพเดทข้อมูลใน Modal
    const titleElement = document.getElementById('problemDetailModalLabel');
    const detailElement = document.getElementById('problemDetail'); // สมมติว่ามี element นี้
    const statusElement = document.getElementById('problemStatus');
    const priorityElement = document.getElementById('problemPriority');
    
    if (titleElement) {
        titleElement.innerHTML = '<i class="fas fa-info-circle me-2"></i>' + 
                                 (problemData.title || 'ชื่องาน');
    }
    
    // แสดงข้อมูลอื่นๆ ด้วย (ถ้ามี element)
    if (detailElement) 
        detailElement.textContent = problemData.detail || '-';
    if (statusElement) 
        statusElement.textContent = problemData.status || '-';
    if (priorityElement) 
        priorityElement.textContent = problemData.priority || '-';
    
    // เปิด Modal
    modal.show();
};

// Event listener สำหรับคอลัมน์รายละเอียดในตาราง
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        // ตรวจสอบว่าคลิกที่ td
        const td = e.target.closest('td');
        
        if (!td) return; // ถ้าไม่ใช่ td ก็ออกไปเลย
        
        const row = td.parentElement;
        
        // ตรวจสอบว่าอยู่ใน TR จริงๆ
        if (row.tagName !== 'TR') return;
        
        const cells = Array.from(row.children);
        const columnIndex = cells.indexOf(td);
        
        // ถ้าเป็นคอลัมน์ที่ 5 (index = 5) คือคอลัมน์รายละเอียด
        if (columnIndex === 5) {
            // เช็คว่ามีข้อมูลครบหรือไม่
            if (cells.length < 9) {
                console.warn('ตารางมีคอลัมน์ไม่ครบ');
                return;
            }
            
            const problemData = {
                title: cells[3]?.textContent.trim() || 'ไม่มีชื่อ',
                detail: cells[5]?.textContent.trim() || 'ไม่มีรายละเอียด',
                status: cells[7]?.textContent.trim() || 'ไม่ระบุ',
                priority: cells[8]?.textContent.trim() || 'ไม่ระบุ'
            };
            
            console.log('ข้อมูลที่ดึงได้:', problemData); // debug
            openProblemDetail(problemData);
        }
    });
});