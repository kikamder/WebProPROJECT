import pool from "../dbConfig/db.js";


export const getProblemlist = async (req, res) =>  {
  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.createat,
        p.location,
        u.firstname AS createdby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM Problem p
      JOIN Users u ON p.createby = u.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      ORDER BY p.problemid ASC
      LIMIT 20;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};