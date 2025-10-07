fetch("/main/data")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("problemTable");
    table.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${row.problemid}</td>
        <td>${row.title || "-"}</td>
        <td>${row.description || "-"}</td>
        <td>${row.categoryname || "-"}</td>
        <td>${row.departmentname || "-"}</td>
        <td>${row.statusstate || "-"}</td>
        <td>${row.prioritylevel || "-"}</td>
        <td>${row.location || "-"}</td>
        <td>${row.createdby || "-"}</td>
        <td>${new Date(row.createat).toLocaleString("th-TH")}</td>
      `;

      table.appendChild(tr);
    });
  })
  .catch(err => {
    console.error("Error fetching problems:", err);
  });