document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // 1. Form Validation
    // ===================================
    const form = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const errorDiv = document.getElementById('passwordError');

    if (form && passwordInput && confirmPasswordInput && errorDiv) {
        form.addEventListener('submit', (event) => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                errorDiv.textContent = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน';
                errorDiv.style.color = 'red';
                event.preventDefault();  // ป้องกันการส่งฟอร์มแล้วโหลดหน้าใหม่
            } else {
                errorDiv.textContent = '';
            }
        });
    }

    // ===================================
    // 2. Modal เปิด/ปิด (แบบธรรมดา)
    // ===================================
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('modal');

    if (openBtn && closeBtn && modal) {
        // เปิด Modal
        openBtn.addEventListener('click', () => {
            modal.classList.add('open');
        });

        // ปิด Modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });

        // ปิดเมื่อคลิกพื้นหลังดำ
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        // ปิดด้วยปุ่ม ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                modal.classList.remove('open');
            }
        });
    }

    // ===================================
    // 3. Click Event - Table & List
    // ===================================
    document.addEventListener('click', function(e) {
        
        // === เช็ค li ก่อน (สำหรับ reportBox) ===
        const li = e.target.closest('li.report-item');
        const reportBox = e.target.closest('#reportBox_lastest');
        
        if (li && reportBox) {
            
            const problemLastestData = {
                problemid: li.dataset.problemid,
                title: li.dataset.title,
                detail: li.dataset.detail,
                status: li.dataset.status,
                priority: li.dataset.priority,
                createDate : li.dataset.createDate,
                creater : li.dataset.creater,
                creadtedByDepartment : li.dataset.creadtedByDepartment,
                createdLocation : li.dataset.createdLocation
            };
            
            
            
            // เช็คว่ามีข้อมูลจริงหรือไม่
            if (problemLastestData.title && problemLastestData.title !== '-') {
                openProblemDetail(problemLastestData);
            } else {
                console.warn('ไม่มีข้อมูลใน dataset');
            }
            return; // หยุดการทำงาน
        }
        
        // === เช็ค td (สำหรับตาราง) ===
        const td = e.target.closest('td');
        
        if (!td) return; // ถ้าไม่ใช่ td และไม่ใช่ li ก็ออกไป
        
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
                priority: cells[8]?.textContent.trim() || 'ไม่ระบุ',
                createDate : cells[1]?.textContent.trim() || 'ไม่ระบุ',
                creater : cells[2]?.textContent.trim() || 'ไม่ระบุ',
                creadtedByDepartment : cells[6]?.textContent.trim() || 'ไม่ระบุ',
                createdLocation : cells[9]?.textContent.trim() || 'ไม่ระบุ'
            };
            
            console.log('ข้อมูลจากตาราง:', problemData);
            openProblemDetail(problemData);
        }
    });



    
    
}); // ปิด DOMContentLoaded


// ===================================
// 4. ฟังก์ชันเปิด Modal (ใช้ Bootstrap)
// ===================================
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
    const detailElement = document.getElementById('problemDetail');
    const statusElement = document.getElementById('problemStatus');
    const priorityElement = document.getElementById('problemPriority');
    const createDateElement = document.getElementById('createDate');
    const createrElement = document.getElementById('creater');
    const creadtedByDepartmentElement = document.getElementById('creadtedByDepartment');
    const createdLocationElement = document.getElementById('createdLocation');


    if (titleElement) {
        titleElement.innerHTML = '<i class="fas fa-info-circle me-2"></i>' + 
                                 (problemData.title || 'ชื่องาน');
    }
    
    // แสดงข้อมูลอื่นๆ ด้วย
    if (detailElement) 
        detailElement.textContent = problemData.detail || '-';
    if (statusElement) 
        statusElement.textContent = problemData.status || '-';
    if (priorityElement) 
        priorityElement.textContent = problemData.priority || '-';
    if (createDateElement)
        createDateElement.textContent = problemData.createDate || '-';
    if (createrElement)
        createrElement.textContent = problemData.creater || '-';
    if (creadtedByDepartmentElement)
        creadtedByDepartmentElement.textContent = problemData.creadtedByDepartment || '-';
    if (createdLocationElement)
        createdLocationElement.textContent = problemData.createdLocation || '-';

    // เปิด Modal
    modal.show();
};