document.addEventListener('DOMContentLoaded',async () => {    
    const page_problem_Container = document.getElementById('page-problem-content');
    if(page_problem_Container) {
    fetch("/main/problemlist/data")
      .then(res => res.json())
      .then(data => {
        const table = document.getElementById("problemTable");
        table.innerHTML = "";
        
        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.problemid}</td>
            <td>${new Date(row.createat).toLocaleString("th-TH")}</td>
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
    fetch("/main/myWorkAssignment/data")
      .then(res => res.json())
      .then(data => {
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
      fetch("/main/myWorkHistory/data")
      .then(res => res.json())
      .then(data => {
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
                ? new Date(row.finishat).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }) 
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
    fetch("/main/data")
      .then(res => {
        if (!res.ok) throw new Error("HTTP status " + res.status);
        return res.json();
      })
      .then(data => {
        const el = document.getElementById("firstname");
        if (!el) return;

        const name = (data && (data.firstname || data.lastname))
        ? `${data.firstname || ''} ${data.lastname || ''}`.trim() // รวมชื่อและนามสกุล และตัดช่องว่างส่วนเกินออก
        : "ไม่ทราบชื่อ";

      el.textContent = name;
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
      });


  
    //fetch and display latest 3 problems in home page
    fetch("/main/problemlastest/data")
    .then(res => {
      if (!res.ok) throw new Error("HTTP status " + res.status);
      return res.json();
    })
    .then(data => {
      
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
        li.dataset.id = row.problemid || '';
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
      
    })
    
    .catch(err => {
      console.error("Error fetching latest problems:", err);
      document.getElementById("reportBox_lastest").innerHTML = 
        '<li class="text-danger py-3">เกิดข้อผิดพลาดในการโหลดข้อมูล</li>';
    });

  }


  // ✅ ส่งฟอร์มไป server (มีเฉพาะหน้าที่มีฟอร์มแจ้งปัญหา)
  const form = document.getElementById("problemForm");
  if(form){ // ✅ เพิ่มเงื่อนไขเช็คก่อน addEventListener
    const sessionRes = await fetch("/api/check-session", { credentials: "include" });
    const sessionData = await sessionRes.json();

    if(!sessionData.loggedIn){
      alert("ยังไม่ได้ login");
      return window.location.href = "/";
    }

    const userId = sessionData.user.usersid; // เอาจาก server session

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

      const res = await fetch("/add-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });

      const result = await res.json();
      if(result.success){
        alert("ส่งข้อมูลสำเร็จ!");
        form.reset();
      } else {
        alert("เกิดข้อผิดพลาด: " + result.message);
      }
    });
  }

  // ✅ ดึงข้อมูล dropdown เฉพาะหน้าที่มี element เหล่านั้น
  const dropdown = document.getElementById("categoryDropdown");
  if(dropdown){ // ✅ เพิ่มเช็ค
    let loaded = false; 
    dropdown.addEventListener("click", () => {
      if (loaded) return;
      fetch("/main/category")
        .then(res => res.json())
        .then(data => {
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
  if(dropdowndep){ // ✅ เพิ่มเช็ค
    let loadeddep = false;
    dropdowndep.addEventListener("click", () => {
      if (loadeddep) return;
      fetch("/main/department")
        .then(res => res.json())
        .then(data => {
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
  if(dropdownpri){ // ✅ เพิ่มเช็ค
    let loadedpri = false;
    dropdownpri.addEventListener("click", () => {
      if (loadedpri) return;
      fetch("/main/priority")
        .then(res => res.json())
        .then(data => {
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

