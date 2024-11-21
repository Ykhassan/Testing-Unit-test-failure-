import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";


// CREATE TABLE "Replies" (
//     "comment_id" serial,
//     "parent_comment_id" serial,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     PRIMARY KEY ("comment_id", "parent_comment_id"),
//     FOREIGN KEY ("comment_id") REFERENCES "Comments" ("comment_id"),
//     FOREIGN KEY ("parent_comment_id") REFERENCES "Comments" ("comment_id")
//   );

/**
 * @swagger
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       properties:
 *         comment_id:
 *           type: integer
 *           description: The unique identifier of the comment being replied to
 *         parent_comment_id:
 *           type: integer
 *           description: The unique identifier of the parent comment, if any, associated with the reply
 *       required:
 *         - comment_id
 *       example:
 *         comment_id: 101
 *         parent_comment_id: 50
 */

const Reply = sequelize.define('Reply',
    {
        comment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true
        },
        parent_comment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    },
    {
        tableName: 'Replies',
        schema: 'public',
        timestamps: true
    }
);



export default Reply;