//DIRECTOR
// GET All director details
// http://localhost:5000/user/getAlldirector
router.get("/getAlldirector", authorization, async (req, res) => {
  try {
    const director = await pool.query("SELECT * FROM director");
    if (director.rows.length !== 0) {
      res.status(200).json(director.rows);
    } else {
      res.status(404).json("No director found!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//GET director details
// http://localhost:5000/user/director
router.get("/director", authorization, async (req, res) => {
  try {
    const director = await pool.query(
      "SELECT * FROM director WHERE $1 = ANY(managers)",
      [req.user]
    );
    if (director.rows.length !== 0) {
      res.status(200).json(director.rows);
    } else {
      res
        .status(404)
        .json({ error: "No director found against current User!!" });
    }
  } catch (error) {
    console.error(error);
  }
});

// DELETE director details
// http://localhost:5000/user/director/:id
router.delete("/director/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      "DELETE FROM director WHERE director_id   = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: `Director with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
});

//MANAGER
// GET All manager details
// http://localhost:5000/user/getAllmanagers
router.get("/getAllmanagers", authorization, async (req, res) => {
  try {
    const manager = await pool.query("SELECT * FROM managers");
    if (manager.rows.length !== 0) {
      res.status(200).json(manager.rows);
    } else {
      res.status(404).json("No manager found!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//GET manager details
// http://localhost:5000/user/manager
router.get("/manager", authorization, async (req, res) => {
  try {
    const manager = await pool.query(
      "SELECT * FROM managers WHERE $1 = ANY(employees)",
      [req.user]
    );
    if (manager.rows.length !== 0) {
      res.status(200).json(manager.rows);
    } else {
      res.status(404).json("No manager found against current User!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//POST manager details
// http://localhost:5000/user/manager
router.post("/manager", async (req, res) => {
  try {
    const { first_name, last_name, title, employees } = req.body;
    const query = await pool.query(
      "INSERT INTO managers (first_name, last_name, title, employees) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, title, employees]
    );
    res.json(query.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// DELETE manager details
// http://localhost:5000/user/manager/:id
router.delete("/manager/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      "DELETE FROM managers WHERE manager_id  = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: `Manager with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
});

//PROJECTS
// GET All project details
// http://localhost:5000/user/getAllprojects
router.get("/getAllprojects", authorization, async (req, res) => {
  try {
    const project = await pool.query("SELECT * FROM projects");
    if (project.rows.length !== 0) {
      res.status(200).json(project.rows);
    } else {
      res.status(404).json("No project found!!");
    }
  } catch (error) {
    console.error(error);
  }
});
//GET projects details
// http://localhost:5000/user/projects
router.get("/projects", authorization, async (req, res) => {
  try {
    const projects = await pool.query(
      "SELECT * FROM projects WHERE $1 = ANY(employees_id)",
      [req.user]
    );

    if (projects.rows.length !== 0) {
      res.status(200).json(projects.rows);
    } else {
      res.status(404).json("No projects found against current User!!");
    }
  } catch (error) {
    console.error(error);
  }
});

//POST projects details
// http://localhost:5000/user/projects
router.post("/projects", async (req, res) => {
  try {
    const { project_name, director_id, manager_id, employees_id } = req.body;
    const query = await pool.query(
      "INSERT INTO projects (project_name, director_id, manager_id,  employees_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [project_name, director_id, manager_id, employees_id]
    );
    res.json(query.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// DELETE project details
// http://localhost:5000/user/trainings/:id
router.delete("/project/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      "DELETE FROM projects WHERE project_id  = $1",
      [id]
    );
    res
      .status(200)
      .json({ message: `Project with id ${id} deleted successfully!!` });
  } catch (error) {
    console.error(error);
  }
});
