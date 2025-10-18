
document.addEventListener('DOMContentLoaded',async () => {    
    const page_problem_Container = document.getElementById('page-problem-content');
    if(page_problem_Container) {
    axios("/main/problemlist/data")
      .then(res => {
        data = res.data;
        const table = document.getElementById("problemTable");
        table.innerHTML = "";
        
        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.dataset.assignat = row.assignat || "-";

          tr.innerHTML = `
            <td>${row.problemid}</td>
            <td>${new Date(row.createat).toLocaleString("th-TH", {
              timeZone: "Asia/Bangkok",
              dateStyle: "short",
              timeStyle: "short"
            })}</td>
            <td>${row.createby || "-"}</td>
            <td>${row.title || "-"}</td>
            <td>${row.categoryname || "-"}</td>
            <td class="col-description">${row.description || "-"}</td>
            <td>${row.departmentname || "-"}</td>
            <td>${row.statusstate || "-"}</td>
            <td>${row.prioritylevel || "-"}</td>
            <td>${row.location || "-"}</td>
            <td>${row.comment || "-"}</td>
          `;
          table.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Error fetching problems:", err);
      });
    }
  
    
  const page_myWorkassignment_content = document.getElementById('page-myWorkassignment-content');
  if(page_myWorkassignment_content) {
    axios.get("/main/myWorkAssignment/data")
      .then(res => {
        data = res.data;
        const table = document.getElementById("myWorkAssignmentTable");
        table.innerHTML = "";

        data.forEach(row => {
          const tr = document.createElement("tr");
          
          tr.dataset.createby = row.createby || "-";
          
          tr.innerHTML = `
            <td >${row.problemid}</td>
            <td>${new Date(row.createat).toLocaleString("th-TH", {
              timeZone: "Asia/Bangkok",
              dateStyle: "short",
              timeStyle: "short"
            })}</td>
            <td>${row.title || "-"}</td>
            <td>${row.categoryname || "-"}</td>
            <td class="col-description">${row.description || "-"}</td>
            <td>${row.departmentname || "-"}</td>
            <td>${row.statusstate || "-"}</td>
            <td>${row.prioritylevel || "-"}</td>
            <td>${row.location || "-"}</td>
            <td>${new Date(row.assignat).toLocaleString("th-TH", {
              timeZone: "Asia/Bangkok",
              dateStyle: "short",
              timeStyle: "short"
            })}</td>
            <td>
              ${
                row.resolvetime
                  ? row.resolvetime >= 60
                    ? Math.floor(row.resolvetime / 60) + " ชั่วโมง" + 
                      (row.resolvetime % 60 !== 0 ? " " + (row.resolvetime % 60) + " นาที" : "")
                    : row.resolvetime + " นาที"
                  : "-"
              }
            </td>
            
          `;
        
          table.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Error fetching problems:", err);
      });
  }

    const page_myWorkHistory_content = document.getElementById('page-myWorkHistory-content');
    if(page_myWorkHistory_content) {
      axios.get("/main/myWorkHistory/data")
      .then(res => {
        data = res.data;
        const table = document.getElementById("myWorkAssignmentHistoryTable");
        
        
      
        
        table.innerHTML = "";

        data.forEach(row => {
          const tr = document.createElement("tr");

          tr.dataset.createby = row.createby || "-";

          tr.innerHTML = `
            <td >${row.problemid}</td>
            <td>${new Date(row.createat).toLocaleString("th-TH", {
              timeZone: "Asia/Bangkok",
              dateStyle: "short",
              timeStyle: "short"
            })}</td>
            <td>${row.title || "-"}</td>
            <td>${row.categoryname || "-"}</td>
            <td class="col-description">${row.description || "-"}</td>
            <td>${row.departmentname || "-"}</td>
            <td>${row.statusstate || "-"}</td>
            <td>${row.prioritylevel || "-"}</td>
            <td>${row.location || "-"}</td>
            <td>${new Date(row.assignat).toLocaleString("th-TH", {
              timeZone: "Asia/Bangkok",
              dateStyle: "short",
              timeStyle: "short"
            })}</td>
            <td>
              ${row.finishat 
                ? new Date(row.finishat).toLocaleString("th-TH", { 
                    timeZone: "Asia/Bangkok",
                    dateStyle: "short",
                    timeStyle: "short" }) 
                : "ยังไม่เสร็จ"}
            </td>
          `;
          table.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Error fetching problems:", err);
      });

    }

  const page_home_Container = document.getElementById('page-main-content');
   if(page_home_Container) {
    axios.get("/main/users/data")
      .then(res => {
        const data = res.data;
        const lastestproblem = document.getElementById("lastestproblem");
        const datasection_home = document.getElementById("datasection_home");
        const el = document.getElementById("firstname");
        if (!el) return;

        if (data.rolename == 'User') {
          lastestproblem.textContent = "รายการปัญหาที่แจ้งล่าสุด";
          axios.get(`/main/users/userCount/data`)
            .then(res2 => {
              const count = res2.data;
              console.log(count);
              datasection_home.textContent =
                `ปัญหาของคุณ : แจ้งปัญหาทั้งหมด ${count.total_work} ปัญหา, 
                ปัญหาใหม่ ${count.newproblem} ปัญหา ,
                อยู่ระหว่างดำเนินการ ${count.in_progress} ปัญหา, 
                รอดำเนินการ ${count.pending} ปัญหา, 
                แก้ไขแล้ว ${count.resolved} ปัญหา`;
            })
            .catch(err => {
              console.error("Error fetching TechCount:", err);
            });
        } 
        else if (data.rolename == 'Admin') {
          lastestproblem.textContent = "รายการปัญหาที่เข้ามาล่าสุด";
        } 
        else if (data.rolename == 'Technician') {
          lastestproblem.textContent = "รายการปัญหาที่รับงานล่าสุด";

          axios.get(`/main/users/TechCount/data`)
            .then(res2 => {
              const count = res2.data;
              console.log(count);
              datasection_home.textContent =
                `งานของคุณ : รับงานมาทั้งหมด ${count.total_work} งาน, 
                อยู่ระหว่างดำเนินการ ${count.in_progress} งาน, 
                รอดำเนินการ ${count.pending} งาน, 
                ปิดแล้ว ${count.resolved} งาน`;
            })
            .catch(err => {
              console.error("Error fetching TechCount:", err);
            });
        }

        const name = (data.firstname || data.lastname)
          ? `${data.firstname || ''} ${data.lastname || ''}`.trim()
          : "ไม่ทราบชื่อ";

        el.textContent = name;
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
    });
  


  
    //fetch and display latest 3 problems in home page
    axios.get("/main/users/data")
    .then(res => {
      data = res.data;
      if(data.rolename == "User") {
        axios.get("/main/problemlastest/data")
        .then(res => {
          data = res.data;
      
          const list = document.getElementById("reportBox_lastest");
          list.innerHTML = "";

          if (data.length === 0) {
            list.innerHTML = '<li class="text-muted py-3">ไม่มีรายการปัญหา</li>';
            return;
          }
         data.forEach(row => {
          const li = document.createElement("li");
          li.className = "report-item py-3";
          li.style.cursor = "pointer";
          
          // เก็บข้อมูลทั้งหมดไว้
          li.dataset.problemId = row.problemid || '';
          li.dataset.title = row.title || '-';
          li.dataset.description = row.description || '-';
          li.dataset.status = row.statusstate || '-';
          li.dataset.priority = row.prioritylevel || '-';
          li.dataset.createat = row.createat || '-';
          li.dataset.createby = row.createby || '-';
          li.dataset.department = row.departmentname || '-';
          li.dataset.location = row.location || '-';
          console.log(li.dataset);
          li.innerHTML = `• ${row.title || "-"} <span class="text-muted">   (${row.statusstate})</span>`;
          list.appendChild(li);
        });
      
    }).catch(err => {
      console.error("Error fetching latest problems:", err);
      document.getElementById("reportBox_lastest").innerHTML = 
        '<li class="text-danger py-3">เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
      });
    }
    if(data.rolename == "Technician") {
        axios.get("/main/LatestWorkAssignment/data")
        .then(res => {
          data = res.data;
      
          const list = document.getElementById("reportBox_lastest");
          list.innerHTML = "";

          if (data.length === 0) {
            list.innerHTML = '<li class="text-muted py-3">ไม่มีรายการปัญหา</li>';
            return;
          }
         data.forEach(row => {
          const li = document.createElement("li");
          li.className = "report-item py-3";
          li.style.cursor = "pointer";
          
          // เก็บข้อมูลทั้งหมดไว้
          li.dataset.problemId = row.problemid || '';
          li.dataset.title = row.title || '-';
          li.dataset.description = row.description || '-';
          li.dataset.status = row.statusstate || '-';
          li.dataset.priority = row.prioritylevel || '-';
          li.dataset.createat = row.createat || '-';
          li.dataset.createby = row.createby || '-';
          li.dataset.department = row.departmentname || '-';
          li.dataset.location = row.location || '-';
          console.log(li.dataset);
          li.innerHTML = `• ${row.title || "-"} <span class="text-muted">   (${row.statusstate})</span>`;
          list.appendChild(li);
        });
      
    }).catch(err => {
      console.error("Error fetching latest problems:", err);
      document.getElementById("reportBox_lastest").innerHTML = 
        '<li class="text-danger py-3">เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
      });
    }
    if(data.rolename == "Admin") {
        axios.get("/main/problemlastest/data")
        .then(res => {
          data = res.data;
      
          const list = document.getElementById("reportBox_lastest");
          list.innerHTML = "";

          if (data.length === 0) {
            list.innerHTML = '<li class="text-muted py-3">ไม่มีรายการปัญหา</li>';
            return;
          }
         data.forEach(row => {
          const li = document.createElement("li");
          li.className = "report-item py-3";
          li.style.cursor = "pointer";
          
          // เก็บข้อมูลทั้งหมดไว้
          li.dataset.problemId = row.problemid || '';
          li.dataset.title = row.title || '-';
          li.dataset.description = row.description || '-';
          li.dataset.status = row.statusstate || '-';
          li.dataset.priority = row.prioritylevel || '-';
          li.dataset.createat = row.createat || '-';
          li.dataset.createby = row.createby || '-';
          li.dataset.department = row.departmentname || '-';
          li.dataset.location = row.location || '-';
          console.log(li.dataset);
          li.innerHTML = `• ${row.title || "-"} <span class="text-muted">   (${row.statusstate})</span>`;
          list.appendChild(li);
        });
      
    }).catch(err => {
      console.error("Error fetching latest problems:", err);
      document.getElementById("reportBox_lastest").innerHTML = 
        '<li class="text-danger py-3">เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
      });
    }
  }).catch(err => {
      console.error("Error fetching latest problems:", err);
      document.getElementById("reportBox_lastest").innerHTML = 
        '<li class="text-danger py-3">เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
      });
    

  }


  //ส่งฟอร์มไป server (มีเฉพาะหน้าที่มีฟอร์มแจ้งปัญหา)
  const form = document.getElementById("problemForm");
if (form) {
  const fullname = document.getElementById("fullname");

  axios.get("/api/check-session", { withCredentials: true })
    .then(sessionRes => {
      const sessionData = sessionRes.data;

      if (!sessionData.loggedIn) {
        alert("ยังไม่ได้ login");
        return (window.location.href = "/");
      }

      const userId = sessionData.user.usersid; // เอาจาก server session
      fullname.value = sessionData.user.firstname + " " + sessionData.user.lastname;
      console.log(sessionData.user.firstname + " " + sessionData.user.lastname);

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
          title: document.getElementById("problemname").value,
          description: document.getElementById("description").value,
          createby: userId,
          categoryid: document.getElementById("categoryDropdown").value,
          statusid: 1,
          departmentid: document.getElementById("departmentDropdown").value,
          priorityid: document.getElementById("priorityDropdown").value,
          location: document.getElementById("locationDropdown").value,
          comment: document.getElementById("comment")?.value || ""
        };

        try { 
          const res = await axios.post("/add-problem", data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          });

          const result = res.data;
          if (result.success) {
            alert("ส่งข้อมูลสำเร็จ!");
            form.reset();
            fullname.value = sessionData.user.firstname + " " + sessionData.user.lastname;
          } else {
            alert("เกิดข้อผิดพลาด: " + result.message);
          }
        } catch (err) { 
          console.error("Error sending data:", err);
          alert("เกิดข้อผิดพลาดระหว่างส่งข้อมูล");
        } 
      }); 
    })
    .catch(err => { 
      console.error("Error checking session:", err);
      alert("เกิดข้อผิดพลาดในการตรวจสอบ session");
    }); 
}
    
  
    
    

  //ดึงข้อมูล dropdown เฉพาะหน้าที่มี element เหล่านั้น
  const dropdown = document.getElementById("categoryDropdown");
  if(dropdown){ 
    let loaded = false; 
    dropdown.addEventListener("click", () => {
      if (loaded) return;
      axios.get("/main/category")
        .then(res => {
          data = res.data
          data.forEach(category => {
            const option = document.createElement("option");
            option.value = category.categoryid;
            option.textContent = category.categoryname;
            dropdown.appendChild(option);
          });
          
          loaded = true;
        })
        .catch(err => console.error(err));
    });
  }

  const dropdowndep = document.getElementById("departmentDropdown");
  if(dropdowndep){ 
    let loadeddep = false;
    dropdowndep.addEventListener("click", () => {
      if (loadeddep) return;

      axios.get("/main/department")
        .then(res => {
          data = res.data;
          data.forEach(department => {
            const option = document.createElement("option");
            option.value = department.departmentid;
            option.textContent = department.departmentname;
            dropdowndep.appendChild(option);
          });
          loadeddep = true;
        })
        .catch(err => console.error(err));
    });
  }

  const dropdownpri = document.getElementById("priorityDropdown");
  if(dropdownpri){ 
    let loadedpri = false;
    dropdownpri.addEventListener("click", () => {
      if (loadedpri) return;

      axios.get("/main/priority")
        .then(res => {
          data = res.data;
          data.forEach(servicelevelagreement => {
            const option = document.createElement("option");
            option.value = servicelevelagreement.priorityid;
            option.textContent = servicelevelagreement.prioritylevel;
            dropdownpri.appendChild(option);
          });
          loadedpri = true;
        })
        .catch(err => console.error(err));
    });
  }
 
});


