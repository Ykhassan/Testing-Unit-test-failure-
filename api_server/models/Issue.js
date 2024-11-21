import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

// DB tables

// CREATE TABLE "Issues" (
//     "issue_id" serial PRIMARY KEY,
//     "user_id" varchar(255),
//     "project_id" serial,
//     "title" text NOT NULL,
//     "description" text NOT NULL,
//     "status" varchar,
//     "closed_at" timestamp,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id"),
//     FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id")
//   );

/**
 * @swagger
 * components:
 *   schemas:
 *     Issue:
 *       type: object
 *       properties:
 *         issue_id:
 *           type: integer
 *           description: The unique identifier for the issue
 *         user_id:
 *           type: string
 *           description: The unique identifier of the user who reported or is assigned to the issue
 *         project_id:
 *           type: integer
 *           description: The identifier of the project associated with the issue
 *         title:
 *           type: string
 *           description: The title of the issue
 *           allowNull: false
 *         description:
 *           type: string
 *           description: A detailed description of the issue
 *           allowNull: false
 *         status:
 *           type: string
 *           description: The current status of the issue (e.g., open, closed, in-progress)
 *         closed_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the issue was closed, if applicable
 *       required:
 *         - title
 *         - description
 *       example:
 *         issue_id: 1
 *         user_id: "12345"
 *         project_id: 101
 *         title: "Bug in login functionality"
 *         description: "The login button is unresponsive when clicked"
 *         status: "open"
 *         closed_at: null
 */


const Issue = sequelize.define('Issue',
    {
        issue_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING(255)
        },
        project_id: {
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING
        },
        closed_at: {
            type: DataTypes.DATE,
            defaultValue: null
        },
    },
    {
        tableName: 'Issues',
        schema: 'public',
        timestamps: true
    }
);

export default Issue