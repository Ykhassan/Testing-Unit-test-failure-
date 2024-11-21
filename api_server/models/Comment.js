import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

// DB tables

// CREATE TABLE "Comments" (
//     "comment_id" SERIAL PRIMARY KEY,
//     "user_id" varchar(255),
//     "content" text NOT NULL,
//     "up_votes" integer DEFAULT 0,
//     "down_votes" integer DEFAULT 0,
//     "last_modified" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
//   );

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         comment_id:
 *           type: integer
 *           description: The unique identifier for the comment
 *         user_id:
 *           type: string
 *           description: The unique identifier of the user who made the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         up_votes:
 *           type: integer
 *           description: The number of upvotes for the comment
 *           default: 0
 *         down_votes:
 *           type: integer
 *           description: The number of downvotes for the comment
 *           default: 0
 *         last_modified:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was last modified
 *           default: "Current Timestamp"
 *       required:
 *         - content
 *       example:
 *         comment_id: 1
 *         user_id: "67890"
 *         content: "This is a comment"
 *         up_votes: 5
 *         down_votes: 2
 *         last_modified: "2023-10-02T14:23:45Z"
 */

const Comment = sequelize.define('Comment',
    { 
        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING(255)
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        up_votes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        down_votes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        last_modified: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'Comments',
        schema: 'public',
        timestamps: true
    }
);

export default Comment;

