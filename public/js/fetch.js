document.addEventListener('DOMContentLoaded',async () => {    
  let allData = [];
  

  const page_AdminDB_content = document.getElementById('page-AdminDB-content');
    if(page_AdminDB_content){
    axios.get("/main/adminaction/data")
      .then(res => {

        const data = res.data;

        // console.log(data);
        const table = document.getElementById("Actiontable");
        table.innerHTML = "";

        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.usersid}</td>
            <td>${row.usersemail}</td>
            <td>${row.fullname}</td>
            <td>${row.teamname}</td>
            <td>${row.departmentname || "-"}</td>
            <td>${row.phonenumber || "-"}</td>
            <td>${row.rolename || "-"}</td>
            <td>
               <a href=/editUser/${row.usersid}>แก้ไขข้อมูล</a>
            </td>
            `;
          table.appendChild(tr);
        });
      })
      .catch(err => {
        if (err.response?.status === 401) {
          console.error("Unauthorized! Please login first.");
        } else {
          console.error("Error fetching Actions:", err);
        }
      });
  }


   const navbarNav = document.getElementById("navbarNav");
    const btnWork = document.getElementById("btnWork");
    if(navbarNav) {
        axios.get("/main/users/data")
        .then(res => {
            user = res.data
            const fullname = document.getElementById("firstname");
            if (fullname) fullname.textContent = user.fullname || "ไม่ระบุชื่อ";

            const menus = ["menu-Admin-add","menu-alluser","menu-adminHome","menu-home", "menu-totalproblem", "menu-mywork", "menu-myReportedHistory", "menu-myworkhistory"];
            menus.forEach(id => {
            const navbar = document.getElementById(id);

            if (navbar) navbar.style.display = "none";
        });

        if (user.rolename === "User") {
            ["menu-home", "menu-totalproblem", "menu-myReportedHistory"].forEach(id => {
            const navbar = document.getElementById(id);
            if (navbar) navbar.style.display = "flex";
            
            console.log(id);
            });
        } else if (user.rolename === "Technician") {
            ["menu-home", "menu-totalproblem", "menu-mywork", "menu-myworkhistory"].forEach(id => {
            const navbar = document.getElementById(id);
            if (navbar) navbar.style.display = "flex";
            if(btnWork) btnWork.style.display = "flex";
            });
          }else if (user.rolename === "Admin") {
            ["menu-home","menu-totalproblem","menu-alluser","menu-Admin-add"].forEach(id => {
            const navbar = document.getElementById(id);
            if (navbar) navbar.style.display = "flex";
            
            });
        } else {
            console.warn("ไม่พบ role ที่ตรงกับผู้ใช้:", user.roleid);
        }
        })
        .catch(err => console.error("Error loading user info:", err));
    }
 
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
              console.error("Error fetching userCount:", err);
            });
        } 
        else if (data.rolename == 'Admin') {
          lastestproblem.textContent = "รายการปัญหาที่เข้ามาล่าสุด";
          const total_problem = document.getElementById('totalproblem');
          const total_newProblem = document.getElementById('newproblem');
          const total_in_progress = document.getElementById('resolvingProblem');
          const total_resolved = document.getElementById('resolvedProblem');
          const lateProblem = document.getElementById('lateProblem');
          const total_Employee = document.getElementById('totalEmply');
          const total_technicianHaswork = document.getElementById('totalActiveTechnician');
          const total_normalEmployee = document.getElementById('totalNormalUser');
          const total_technician = document.getElementById('totalTechnician');
          axios.get("/main/users/dashboard/data")
          .then(res => {
            const data = res.data
            console.log(data);
            total_problem.textContent = data.total_problem;
            total_newProblem.textContent = data.total_newproblem;
            total_in_progress.textContent = data.total_in_progress;
            total_resolved.textContent = data.total_resolved;
            total_Employee.textContent = data.total_employee;
            lateProblem.textContent = data.total_overdueproblem;
            total_technicianHaswork.textContent = data.total_technicianhaswork;
            total_normalEmployee.textContent = data.total_normalemployee;
            total_technician.textContent = data.total_technician;
          }).catch(err => {
            console.error("Error fetching dashboard:", err);
          })
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
        axios.get("/main/allProblemLastest/data")
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

  const page_history_Container = document.getElementById('page-history-content');
  if (page_history_Container) {
    axios.get("/main/myHistory/data")
      .then(response => {
        const data = response.data; // ✅ axios แปลง JSON ให้อัตโนมัติ
        const table = document.getElementById("problemTable");
        table.innerHTML = "";

        if (data.length === 0) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="11" class="text-center text-muted py-3">ไม่มีรายการปัญหา</td>`;
          table.appendChild(tr);
          return;
        }

        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.problemid}</td>
            <td>${new Date(row.createat).toLocaleString("th-TH")}</td>
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
        console.error("Error fetching myHistory data:", err);
        // สามารถแจ้งผู้ใช้ได้ เช่น alert หรือแสดงในหน้า
        // alert("เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ");
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

  const teamDropdown = document.getElementById("teamDropdown");
  if(teamDropdown) {
     axios.get("/getTeam/data")
            .then(res => {
                const teams = res.data
                console.log("Team" , teams)
                teams.forEach(team => {
                    const option = document.createElement("option");
                    option.value = team.teamid;
                    option.textContent = team.teamname;
                    teamDropdown.appendChild(option);
                });
            }).catch(error =>{
                console.log("ERROR" , error);
            });
  }

  const roleDropdown = document.getElementById("roleDropdown");
  if(roleDropdown) {
     axios.get("/getRole/data")
      .then(res => {
        const role = res.data
        console.log("Team" , role)
                role.forEach(roles => {
                    const option = document.createElement("option");
                    option.value = roles.roleid;
                    option.textContent = roles.rolename;

                    roleDropdown.appendChild(option);
                });
            }).catch(error =>{
                console.log("ERROR" , error);
            });
  }

  let loadedpri = false;
  const dropdownpri = document.getElementById("priorityDropdown");
  if(dropdownpri){ 
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
    
  }

   



    //ปุ่มเลือกสถานะ
    // const tableBody = document.getElementById("problemTable");
    // const statusMap = {
    //   "all": "all",
    //   "pending": "Pending/รอข้อมูล",
    //   "in-progress": "Open/กำลังดำเนินการ",
    //   "completed": "Closed/ปิดงานแล้ว"
    // };

    //จำไม่ได้ว่าอันนี้เพิ่มมาใหม่รึเปล่าเช็คเอานะคะ
    // ฟังก์ชันดึงข้อมูลจาก API
    // function loadData() {
    //     axios.get("/main/problemlist/data") // เปลี่ยนเป็น endpoint จริงของคุณ
    //         .then(res => {
    //             allData = res.data; // เก็บข้อมูลทั้งหมด
    //             renderTable(allData); // แสดงตารางทั้งหมดตอนแรก
    //         })
    //         .catch(err => {
    //             console.error("Error fetching data:", err);
    //         });
    // }

    // ฟังก์ชันสร้าง row ของ table
    // function renderTable(data) {
    //     tableBody.innerHTML = ""; // ล้างตารางก่อน
    //     data.forEach(item => {
    //         const row = document.createElement("tr");
    //         row.innerHTML = `
    //             <td>${item.problemid}</td>
    //             <td>${item.createat}</td>
    //             <td>${item.createby}</td>
    //             <td>${item.title}</td>
    //             <td>${item.categoryname}</td>
    //             <td>${item.description}</td>
    //             <td>${item.departmentname}</td>
    //             <td>${item.statusstate}</td>
    //             <td>${item.prioritylevel}</td>
    //             <td>${item.location}</td>
    //             <td>${item.comment || ''}</td>
    //         `;
    //         tableBody.appendChild(row);
    //     });
    // }

    // ================== //
    // ฟังก์ชันสร้าง row ของ table
    
  //   function renderTable(data) {
  //   if (!tableBody) return; // ถ้าไม่มี tableBody ให้ return ทันที // ป้องกัน error ถ้า tableBody เป็น null
  //   tableBody.innerHTML = "";
  //   data.forEach(item => {
  //     const tr = document.createElement("tr");
  //     tr.innerHTML = `
  //       <td>${item.problemid}</td>
  //       <td>${new Date(item.createat).toLocaleString("th-TH")}</td>
  //       <td>${item.createby || "-"}</td>
  //       <td>${item.title || "-"}</td>
  //       <td>${item.categoryname || "-"}</td>
  //       <td>${item.description || "-"}</td>
  //       <td>${item.departmentname || "-"}</td>
  //       <td>${item.statusstate || "-"}</td>
  //       <td>${item.prioritylevel || "-"}</td>
  //       <td>${item.location || "-"}</td>
  //       <td>${item.comment || "-"}</td>
  //     `;
  //     tableBody.appendChild(tr);
  //   });
  // }

    // ================== //
    // ฟังก์ชันกรองสถานะ อันนี้มีแก้ให้พอกดปุ่มแล้วเปลี่ยนสีข้างหลังปุ่มตามด้วย 
    // function filterStatus(status) {
    //       if(status === "all") {
    //           // console.log(filtered);
    //           renderTable(allData);
    //           return;
    //       } else {
    //         const mappedStatus = statusMap[status].trim().toLowerCase();
    //         const filtered = allData.filter(item => item.statusstate && item.statusstate.trim().toLowerCase() === mappedStatus);
    //         console.log("Mapping status:", mappedStatus);
    //         console.log("Filtered items:", filtered);
    //           // const filtered = allData.filter(item => item.statusstate === status);
    //           renderTable(filtered);
    //       }
    //   }
    //   document.querySelectorAll('.btn-filter').forEach(button => {
    //   button.addEventListener('click', () => {
    //     //ลบคลาส active ออกจากปุ่มทั้งหมด
    //     document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    //     //เพิ่มคลาส active ให้ปุ่มที่คลิก
    //     button.classList.add('active');

    //     //อ่านค่า data-filter ของปุ่ม
    //     const status = button.dataset.filter;
    //     filterStatus(status);
    //   });
    // });
    // loadData(); // เริ่มโหลดข้อมูล อันนี้ต้องใส่ไม่งั้นจะไม่โหลดข้อมูลมาแสดง
});


