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
      ORDER BY p.problemid ASC;`);

    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};


export const getProblemlastest = async (req, res) =>  {
  
  try {
    const result = await pool.query(`
      SELECT
        p.problemid,
        p.title,
        s.statusstate
      FROM Problem p
      JOIN Status s ON p.statusid = s.statusid
	    WHERE p.createby = $1
      ORDER BY p.problemid DESC
      LIMIT 3;
    ` , [req.session.user.usersid]);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyWorkAssignment = async (req, res) =>  {
  try {
      const result = await pool.query(`
      SELECT
        p.problemid,
        p.createat,
        p.title,
        c.categoryname,
        p.description,
        d.departmentname,
        s.statusstate,
        sla.prioritylevel,
        p.location,
        wk.assignat,
        sla.resolvetime,
        wk.finishat
      from problem p
      JOIN department d on p.departmentid = d.departmentid
      join status s on p.statusid = s.statusid
      join workassignment wk on p.problemid = wk.problemid
      join category c on p.categoryid = c.categoryid
      join servicelevelagreement sla on p.priorityid = sla.priorityid
      join users u on u.usersid = wk.usersid
     
      WHERE wk.usersid = $1 AND p.statusid != 5
      ORDER BY p.problemid ASC;
      ;`, [req.session.user.usersid]);
      res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getMyWorkHistory = async (req, res) =>  {
  try {
      const result = await pool.query(`
      SELECT
        p.problemid,
        p.createat,
        p.title,
        c.categoryname,
        p.description,
        d.departmentname,
        s.statusstate,
        sla.prioritylevel,
        p.location,
        wk.assignat,
        sla.resolvetime,
        wk.finishat
      from problem p
      JOIN department d on p.departmentid = d.departmentid
      join status s on p.statusid = s.statusid
      join workassignment wk on p.problemid = wk.problemid
      join category c on p.categoryid = c.categoryid
      join servicelevelagreement sla on p.priorityid = sla.priorityid
      join users u on u.usersid = wk.usersid
     
      WHERE wk.usersid = $1
      ORDER BY p.problemid ASC;
      ;`, [req.session.user.usersid]);
      res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

