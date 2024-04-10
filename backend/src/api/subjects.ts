import { isSubject } from "checkers";
import { pool } from "db";
import { Router } from "express";

const subjectRouter = Router();

subjectRouter.get("/", (_req, res) => {
    res.send("Subjects API");
});

subjectRouter.get("/all", async (_req, res) => {
    const [result, _fields] = await pool.execute(`
        SELECT \`subject-code\`, name FROM subject
    `);

    if (!Array.isArray(result)) {
        res.status(500).send("Internal Server Error (subjects not a list)");
        return;
    }

    for (const subject of result) {
        if (!isSubject(subject)) {
            res.status(500).send("Internal Server Error (subject not a subject?)");
            return;
        }
    }

    res.json(result);
})

export default subjectRouter;