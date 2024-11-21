import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";


// CREATE TABLE "Projects_comments" (
//     "project_id" serial,
//     "comment_id" serial,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     PRIMARY KEY ("project_id", "comment_id"),
//     FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id"),
//     FOREIGN KEY ("comment_id") REFERENCES "Comments" ("comment_id")
//   );

/**
 * @swagger
 * components:
 *   schemas:
 *     Projects_comment:
 *       type: object
 *       properties:
 *         project_id:
 *           type: integer
 *           description: The unique identifier of the project associated with the comment
 *         comment_id:
 *           type: integer
 *           description: The unique identifier of the comment associated with the project
 *       required:
 *         - project_id
 *         - comment_id
 *       example:
 *         project_id: 1
 *         comment_id: 101
 */

const ProjectComments = sequelize.define('ProjectComments',
    {
        project_id: {
            type: DataTypes.INTEGER
        },
        comment_id: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: 'Projects_comments',
        schema: 'public',
        timestamps: true
    }
);

export default ProjectComments;    