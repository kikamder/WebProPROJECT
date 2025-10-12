document.addEventListener('DOMContentLoaded', () => {    
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
            <td>${row.createdby || "-"}</td>
            <td>${row.title || "-"}</td>
            <td>${row.categoryname || "-"}</td>
            <td>${row.description || "-"}</td>
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

          const firstname = data && data.firstname ? data.firstname : "ไม่ทราบชื่อ";
        el.textContent = firstname;
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
      });


    // Fetch and display the latest 3 problems in home page

  //   fetch("/main/problemlastest/data")
  //   .then(res => {
  //     if (!res.ok) throw new Error("HTTP status " + res.status);
  //     return res.json();
  //   })
  //   .then(data => {
  //     const list = document.getElementById("reportBox");
  //     list.innerHTML = "";

  //     data.forEach(row => {
  //       const li = document.createElement("li");
  //       li.innerHTML = `
  //         <li class="report-item py-3">${row.title || "-"}  สถานะ :  ${row.statusstate}</li>
  //       `;
  //       list.appendChild(li);
  //     });
  //   })
  //   .catch(err => {
  //     console.error("Error fetching latest problems:", err);
  //   });

  // }

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
        li.dataset.problemid = row.problemid || '';
        li.dataset.title = row.title || '-';
        li.dataset.detail = row.detail || '-';
        li.dataset.status = row.statusstate || '-';
        li.dataset.priority = row.priority || '-';
        
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

  
  
  
    
});