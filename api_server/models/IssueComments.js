import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

// CREATE TABLE "Issues_comments" (
//     "issue_id" serial,
//     "comment_id" serial,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     PRIMARY KEY ("issue_id", "comment_id"),
//     FOREIGN KEY ("issue_id") REFERENCES "Issues" ("issue_id"),
//     FOREIGN KEY ("comment_id") REFERENCES "Comments" ("comment_id")
//   );
  
/**
 * @swagger
 * components:
 *   schemas:
 *     Issue_comment:
 *       type: object
 *       properties:
 *         issue_id:
 *           type: integer
 *           description: The unique identifier of the issue associated with the comment
 *         comment_id:
 *           type: integer
 *           description: The unique identifier of the comment associated with the issue
 *       required:
 *         - issue_id
 *         - comment_id
 *       example:
 *         issue_id: 1
 *         comment_id: 101
 */

const IssueComments = sequelize.define('IssueComments', 
    {
        issue_id: {
            type: DataTypes.INTEGER
        },
        comment_id: {
            type: DataTypes.INTEGER
        }
    },
    {
        tableName: 'Issues_comments',
        schema: 'public',
        timestamps: true
    }
);

export default IssueComments;
 