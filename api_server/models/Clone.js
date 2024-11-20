import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

// CREATE TABLE "Clones" (
//     "project_id" serial,
//     "clone_id" serial,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     PRIMARY KEY ("project_id", "clone_id"),
//     FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id"),
//     FOREIGN KEY ("clone_id") REFERENCES "Projects" ("project_id")
//   );

/**
 * @swagger
 * components:
 *   schemas:
 *     Clone:
 *       type: object
 *       properties:
 *         project_id:
 *           type: integer
 *           description: The unique identifier for the project.
 *         clone_id:
 *           type: integer
 *           description: The unique identifier for the clone.
 *       required:
 *         - project_id
 *         - clone_id
 *       example:
 *         project_id: 1
 *         clone_id: 2
 */
const Clone = sequelize.define('Clone', {
    project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    parent_project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
}, {
    tableName: 'Clones',
    schema: 'public',
    timestamps: true
});

export default Clone;