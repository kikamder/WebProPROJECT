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
                problemId: li.dataset.problemId,
                title: li.dataset.title,
                description: li.dataset.description,
                status: li.dataset.status,
                priority: li.dataset.priority,
                createat: li.dataset.createat,
                createby: li.dataset.createby,
                department: li.dataset.department,
                location: li.dataset.location
            };
            
            if (problemLastestData.title && problemLastestData.title !== '-') {
                    
                openProblemDetail(problemLastestData);
            } else {
                console.warn('ไม่มีข้อมูลใน dataset');
            }
            return; // จบเคส li
        }

        // === เช็ค td (สำหรับตาราง) ===
        const td = e.target.closest('td');
        if (!td) return;

        const row = td.closest('tr');
        if (!row) return;

        // หา table ที่ td นี้อยู่ในนั้น
        const table = td.closest('table');
        if (!table) return;

        // หา <th id="th_description"> ภายในตารางนั้นโดยเฉพาะ
        const descriptionHeader = table.querySelector('th#th_description');
        if (!descriptionHeader) return; // ถ้าไม่มีคอลัมน์นี้ก็ข้ามไปเลย

        // หา index ของคอลัมน์ description ภายในตารางนั้น
        const headers = Array.from(descriptionHeader.parentElement.children);
        const descriptionColumnIndex = headers.indexOf(descriptionHeader);

        // หาว่าคลิกอยู่คอลัมน์ไหน
        const cells = Array.from(row.children);
        const columnIndex = cells.indexOf(td);

        // ถ้าคลิกในคอลัมน์รายละเอียด
        if (columnIndex === descriptionColumnIndex) {
            // สร้าง object problemData โดยอิงจาก id ของ <th>
            const data = {};
            headers.forEach((header, idx) => {
                const id = header.id?.replace(/^th_/, ''); // เช่น 'th_title' -> 'title'
                if (id){
                     data[id] = cells[idx]?.textContent.trim() || '';
                }
                
                
            });
            
            
            const createbyHeader = table.querySelector('th#th_createby');
            
                // ถ้าไม่มี header 'th_createby'
             if (!createbyHeader) {
                data.createby = row.dataset.createby || '-';
             }           
             
          //  data.createby = td.closest("tr")?.dataset.createby || '-';
            if(user.rolename == "Admin"){
             axios.get(`/main/assigned/${data.problemId}`)
            .then(res => {
                const result = res.data;

                data.rolename = user.rolename;
                data.assignby = result.map(item => item.assignby);
                data.usersid = result.map(item => item.usersid);

                console.log('ข้อมูลจากตาราง:', data);

                openProblemDetail(data);
            }).catch(error => {
                console.log("Getting worker Error" , error);
            });

            }else {
                openProblemDetail(data);
            }
            
            
            
            
            
        }


        
        
    });


    const acceptBtn = document.getElementById("acceptButton");
        if (acceptBtn) {
            acceptBtn.addEventListener("click", (e) => {
                
                const problemId = e.target.dataset.problemId;
                const statusstate = e.target.dataset.status;
                isProcessing = true;
                acceptBtn.disabled = true;

                axios.post(`/main/problem/accept/${problemId}`, {
                        statusstate: statusstate 
                        
                })
                
                .then(res => {
                    const result = res.data; 
                    if (result.success) {
                        alert("รับงานเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                    } 
                    
                    
                })

                .catch(err => {

                     if(err.message){
                        alert(err.response.data.message);
                        location.reload();
                        console.log(err);
                     }
                     
                console.error("เกิดข้อผิดพลาด:", err);
                });

                console.log("รับงานหมายเลข:", problemId);
            });
            
        }

    const workCancelbtn = document.getElementById("workCancelbtn");
    if(workCancelbtn) {
        workCancelbtn.addEventListener("click", (e) => {
            
            if(confirm("คุณต้องการยกเลิกงานนี้ใช่หรือไม่?")){
                
                const problemId = e.target.dataset.problemId;
                console.log("ยกเลิกงานหมายเลข:", problemId);
                axios.post(`/main/problem/cancel/${problemId}`)
            
                .then(res => {
                    result = res.data;
                    if (result.success) {
                        alert("ยกเลิกงานเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                    }
                })
                .catch(err => {
                console.error("เกิดข้อผิดพลาด:", err);
                alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
                });
        }else{

        }
        });
    }

    const editsection = document.getElementById("editsectionshow");
    const editconfirmbtn = document.getElementById("editconfirmbtn");
    const workUpdatebtn = document.getElementById("workUpdatebtn");
    const optionsection = document.getElementById("optionsection");
    if(workUpdatebtn) {
        let n = 0;
        workUpdatebtn.addEventListener("click", (e) => {
            n++;
            if(n%2==1){
                 editsection.style.display = "flex";
            }
            else{
                 editsection.style.display = "none";
                 optionsection.value = "";
                 
            }
        if(n==10) n=0;
        

        });

        editconfirmbtn.addEventListener("click", (e) => {
            
            const problemId =  workUpdatebtn.dataset.problemId;
            if(optionsection.value >= 2){
                axios.post(`/main/problem/update/${problemId}`, {
                    statusid: optionsection.value
                    })
                    .then(res => {
                        if (res.data.success == true) {
                        alert("อัพเดทสถานะเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                       
                        }
                    })
                    .catch(err => console.error(err));
            }


        });

    }
    const workFinishbtn = document.getElementById("workFinishbtn");
    if(workFinishbtn) {
        workFinishbtn.addEventListener("click", (e) => {
            if(confirm("คุณต้องการเสร็จสิ้นงานนี้ใช่หรือไม่?")){
                const problemId = e.target.dataset.problemId;
                const datetime = new Date();
                axios.post(`/main/problem/update/${problemId}`, {
                    statusid: 4,
                    finishat : datetime
                    })
                    .then(res => {
                        if (res.data.success == true) {
                        alert("ปิดงานเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                        }
                    })
                    .catch(err => console.error(err));
                console.log("ปิดงานหมายเลข:", problemId);
            }
        });
    }


  const attachBtn = document.getElementById("attachBtn");
  const fileInput = document.getElementById("fileInput");
  const previewArea = document.getElementById("previewArea");
  if(attachBtn && fileInput && previewArea){
  // ====================================================
  // =========== เมื่อคลิกปุ่ม attach → เปิดเลือกไฟล์ ===========
  // ====================================================
  attachBtn.addEventListener("click", () => fileInput.click());

  // เมื่อผู้ใช้เลือกไฟล์
  fileInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    previewArea.innerHTML = ""; // เคลียร์ preview เดิม

    files.forEach(file => {
      const fileType = file.type;
      const fileBox = document.createElement("div");
      fileBox.classList.add("preview-box");

      // ถ้าเป็นรูป (jpg, png)
      if (fileType.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = file.name;
          img.classList.add("preview-thumb");

          const name = document.createElement("p");
          name.textContent = file.name;
          name.classList.add("preview-name");

          fileBox.appendChild(img);
          fileBox.appendChild(name);
          previewArea.appendChild(fileBox);
        };
        reader.readAsDataURL(file);
      }
      // ถ้าเป็น PDF
      else if (fileType === "application/pdf") {
        const icon = document.createElement("div");
        icon.classList.add("pdf-icon");
        icon.textContent = "📄";

        const name = document.createElement("p");
        name.textContent = file.name;
        name.classList.add("preview-name");

        fileBox.appendChild(icon);
        fileBox.appendChild(name);
        previewArea.appendChild(fileBox);
      }
        });
    });

    }

    const employeeForm123 = document.getElementById("employeeForm123");
    
    if(employeeForm123) {
        const submitUserData = document.getElementById("submitUserData");
        const employeeId123 = document.getElementById("employeeId123");
        const firstName123 = document.getElementById("firstName123");
        const lastName123 = document.getElementById("lastName123");
        const email123 = document.getElementById("email123");
        const team123 = document.getElementById("team123");
        const permission123 = document.getElementById("permission123");
        const teamFirst = document.getElementById("teamFirst");
        const roleFirst = document.getElementById("roleFirst");



        const path = window.location.pathname;  
        const userId = path.split("/")[2]; 
        
        employeeId123.value = userId;
        axios.get(`/userform/edit/${userId}`)
        .then(res => {
            data = res.data;
            console.log(data);
            
            email123.value = data.usersemail;
            firstName123.value = data.firstname;
            lastName123.value = data.lastname;
            
            ``
           teamFirst.value = data.teamname;
           roleFirst.value = data.rolename;

            axios.get("/getTeam/data")
            .then(res => {
                const teams = res.data
                console.log("Team" , teams)
                teams.forEach(team => {
                    const option = document.createElement("option");
                    option.value = team.teamid;
                    option.textContent = team.teamname;
                    team123.appendChild(option);
                });
            }).catch(error =>{
                console.log("ERROR" , error);
            });


            
            axios.get("/getRole/data")
            .then(res => {
                const role = res.data
                console.log("Team" , role)

                permission123.innerHTML = "";

                role.forEach(roles => {
                    const option = document.createElement("option");
                    option.value = roles.roleid;
                    option.textContent = roles.rolename;

                    permission123.appendChild(option);
                });

                
            }).catch(error =>{
                console.log("ERROR" , error);
            });
            
            
            
        }).catch(error => {
            console.log("ERROR" , error);
        });
        

        

        submitUserData.addEventListener("click", () => {
            const selectedTeamId = team123.value;
            const selectedTeamName = team123.options[team123.selectedIndex].text;

            const selectedRoleId = permission123.value;
            const selectedRoleName = permission123.options[permission123.selectedIndex].text;

            axios.post("/submitEditUser", {
                userid: employeeId123.value,
                email: email123.value,
                firstName123: firstName123.value,
                lastName123: lastName123.value,
                teamid: selectedTeamId,
                teamname: selectedTeamName,
                roleid: selectedRoleId,
                rolename: selectedRoleName
                })
                .then(res => {
                    const data = res.data;
                    if(data.success) {
                        alert("อัพเดตข้อมูลสำเร็จ");
                        location.reload();
                    }
                
                })
                .catch(error => {
                    console.error("ERROR:", error);
                });

                console.log({
                    userid: employeeId123.value,
                    email: email123.value,
                    firstName123: firstName123.value,
                    lastName123: lastName123.value,
                    teamid: selectedTeamId,
                    teamname: selectedTeamName,
                    roleid: selectedRoleId,
                    rolename: selectedRoleName
                });
        });
        
    }



    const addBtn = document.getElementById("addUserBtn");
    const formadd = document.getElementById("Addform");

    if (!addBtn || !formadd) return;

    addBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const firstname = document.getElementById("firstname").value.trim();
        const lastname = document.getElementById("lastname").value.trim();
        const telnum = document.getElementById("telnum").value;
        const teamId = document.getElementById("teamDropdown").value;
        const roleId = document.getElementById("roleDropdown").value;
        const password = document.getElementById("password").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!firstname || !lastname || !telnum || !teamId || !roleId || !password || !email) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
        }

        try {
        const res = await axios.post("/add-user", {
            firstname,
            lastname,
            teamId,
            roleId,
            password,
            email,
        });

        if (res.data.success) {
            alert("เพิ่มข้อมูลสำเร็จ!");
            formadd.reset();
            this.location.reload();
        } else {
            alert("เพิ่มข้อมูลไม่สำเร็จ: " + res.data.message);
        }
        } catch (err) {
        console.error("Error adding user:", err);
        alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
        }
    });




    
}); // ปิด DOMContentLoaded


    

// ฟังก์ชันโหลด dropdown ของ admin
 function loadAdminDropdowns(problemData) {
    console.log("กำลังโหลด dropdowns...");

    // 🔹 โหลดผู้รับผิดชอบ
    const assignDropdown = document.getElementById("assignDropdown");
    if (assignDropdown) {
        assignDropdown.innerHTML = ""; // เคลียร์ของเดิม

        const assignby = problemData.assignby; // ["Rapeephat Boontool"]
        const usersid = problemData.usersid;   // [2]

        // วนลูปสร้าง <option>
        assignby.forEach((name, index) => {
            const option = document.createElement("option");
            option.value = usersid[index]; // ดึงค่า id ตามลำดับเดียวกัน
            option.textContent = name;     // แสดงชื่อผู้รับผิดชอบ
            assignDropdown.appendChild(option);
        });
    }

       const statusDropdown = document.getElementById("statusDropdown");
       if(statusDropdown){
            axios.get("/main/status")
            .then(res => {
                const status = res.data;
                
                console.log(status)

                

                status.forEach(status => {
                const option = document.createElement("option");
                option.textContent = status.statusstate;
                statusDropdown.appendChild(option);
                })
            }).catch( error => {
                console.log("Error getting data " , error);
            });
            loadedstatus = true;
        }
    // ปุ่มบันทึก admin
    const saveAdminEdit = document.getElementById("saveAdminEdit");
        if(saveAdminEdit){
            saveAdminEdit.addEventListener("click", () => {
                
                const problemId = problemData.problemId;
        if (!problemId) return alert("ไม่พบ Problem ID");

             const data = {
                problemId: problemId,
                statusid: document.getElementById("statusDropdown").value,
                priorityid: document.getElementById("priorityDropdown").value
            };
            if(data.priorityid == "" && data.statusid == "") return;

            axios.post(`/main/problemList/update/${problemId}`,{
                statusid : data.statusid,
                priorityid : data.priorityid
            }).then(res => {
                const data = res.data
                if(data.success)
                    alert("บันทึกเรียบร้อย")
                location.reload();

            }).catch(error => {
                alert("ERROR " , error);
            });

        console.log(problemId);
    });
}
}



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
    
    const acceptBtn = document.getElementById("acceptButton");
    const workUpdatebtn = document.getElementById("workUpdatebtn");
    const workCancelbtn = document.getElementById("workCancelbtn");
    const workFinishbtn = document.getElementById("workFinishbtn");
    const titleElement = document.getElementById('problemDetailModalLabel');
    const detailElement = document.getElementById('problemDetail');
    const statusElement = document.getElementById('problemStatus');
    const priorityElement = document.getElementById('problemPriority');
    const createDateElement = document.getElementById('createDate');
    const createrElement = document.getElementById('creater');
    const creadtedByDepartmentElement = document.getElementById('creadtedByDepartment');
    const createdLocationElement = document.getElementById('createdLocation');
    const action_section = document.getElementsByClassName("action-section")[0];

    if (titleElement) {
        titleElement.innerHTML = '<i class="fas fa-info-circle me-2"></i>' + 
                                 (problemData.title || 'ชื่องาน');
    }
    
    // แสดงข้อมูลอื่นๆ ด้วย
    if (detailElement) 
        detailElement.textContent = problemData.description || '-';
    if (statusElement) 
        statusElement.textContent = problemData.status || '-';
        
    if (priorityElement) 
        priorityElement.textContent = problemData.priority || '-';
    if (createDateElement)
        createDateElement.textContent = problemData.createat || '-';
    if (createrElement)
        createrElement.textContent = problemData.createby || '-';

    if (creadtedByDepartmentElement)
        creadtedByDepartmentElement.textContent = problemData.department || '-';
    if (createdLocationElement)
        createdLocationElement.textContent = problemData.location || '-';

    if (acceptBtn) {
        if(problemData.status == "Resolved / แก้ไขแล้ว") {
            acceptBtn.style.display = "none"
        }else {
            acceptBtn.style.display = "inline"
            acceptBtn.dataset.problemId = problemData.problemId;
            acceptBtn.dataset.status = problemData.status;
        }
        
        
    }
    if(user.rolename == 'Technician'){
        if(workUpdatebtn && workCancelbtn && workFinishbtn) {
            if(problemData.status != "Resolved / แก้ไขแล้ว") {
                action_section.style.display = "flex";   
                workCancelbtn.dataset.problemId = problemData.problemId;
                workUpdatebtn.dataset.problemId = problemData.problemId;
                workFinishbtn.dataset.problemId = problemData.problemId;
            
            }else{
                action_section.style.display = "none";}
        }
    }

    if (problemData.rolename === "Admin") {
        document.getElementById("adminEditSection").style.display = "flex";
        loadAdminDropdowns(problemData);

    } else {
        const adminEditSection = document.getElementById("adminEditSection")
        
        if(adminEditSection)
            adminEditSection.style.display = "none";
    }
        
        
    

    // เปิด Modal
    
    modal.show();
};


