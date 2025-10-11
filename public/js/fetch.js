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

  const page_main_Container = document.getElementById('page-main-content');
  if(page_main_Container) {
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
  }
  
    
    
});