// ขอข้อมูลจากดาต้าเบสมาเก็บในรูปแบบ JSON
fetch("/main/data")
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

  // ดึงช้อมูลผู้ใช้ไปสวัสดี
  fetch("/main/home/data")
  .then(res => {
    if (!res.ok) throw new Error("HTTP status " + res.status);
    return res.json();
  })
  .then(data => {
    const el = document.getElementById("username");
    if (!el) return;

    const firstname = data && data.firstname ? data.firstname : "ไม่ทราบชื่อ";
    el.textContent = firstname;
  })
  .catch(err => {
    console.error("Error fetching user data:", err);
  });


//อัพเดตรหัสผ่าน
document.addEventListener("DOMContentLoaded", () => {
  const updateBtn = document.getElementById("updatePassword");

  if (updateBtn) {
    updateBtn.addEventListener("click", (e) => {
      e.preventDefault(); // ✨ กันไม่ให้ส่ง /login/changepassword
      const password = document.getElementById("passwordInput").value;
      const confirmPassword = document.getElementById("confirm_password").value;

      // ตรวจสอบรหัสผ่านตรงกัน
      if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่");
        return;
      }

      // ส่งไป server
      fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include"
      })
      .then(res => res.json())
      .then(res => {
        if(res.success){
          alert("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
          window.location.href = "/page/home.html";
        } else {
          alert("เกิดข้อผิดพลาด: " + res.error);
        }
      });
    });
  }
});





