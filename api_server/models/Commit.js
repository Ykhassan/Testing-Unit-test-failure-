import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";


/**
 * @swagger
 * components:
 *   schemas:
 *     Commit:
 *       type: object
 *       properties:
 *         commit_id:
 *           type: integer
 *           description: The unique identifier for the commit
 *         user_id:
 *           type: string
 *           description: The unique identifier for the user who made the commit
 *         branch_id:
 *           type: integer
 *           description: The unique identifier for the branch where the commit was made
 *         role:
 *           type: string
 *           description: The role of the user in relation to the commit (e.g., author, contributor)
 *         msg:
 *           type: string
 *           description: The commit message describing the changes made
 *         hash:
 *           type: string
 *           description: The unique hash representing the commit
 *         url:
 *           type: string
 *           description: The URL pointing to the commit (e.g., in a Git repository)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the commit was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the commit was last updated
 *       required:
 *         - commit_id
 *         - user_id
 *         - branch_id
 *         - msg
 *         - hash
 *       example:
 *         commit_id: 1
 *         user_id: "12345"
 *         branch_id: 2
 *         role: "author"
 *         msg: "Initial commit with project setup"
 *         hash: "abcd1234efgh5678"
 *         url: "http://example.com/commit/abcd1234"
 *         createdAt: "2023-10-01T12:34:56Z"
 *         updatedAt: "2023-10-01T12:34:56Z"
 */

const Commit = sequelize.define('Commit',{ 
    commit_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    branch_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(255)
    },
    msg:{
        type: DataTypes.TEXT
    },
    hash:{
        type: DataTypes.TEXT
    },
    url: {
        type: DataTypes.TEXT
    }
 },
    {
        tableName: 'Commits',
        schema: 'public',
        timestamps: true
    }
);

export default Commit;