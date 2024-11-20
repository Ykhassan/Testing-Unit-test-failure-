import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";


/**
 * @swagger
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         branch_id:
 *           type: integer
 *           description: The unique identifier for the branch
 *         project_id:
 *           type: integer
 *           description: The unique identifier for the project associated with the branch
 *         name:
 *           type: string
 *           description: The name of the branch
 *         last_modified:
 *           type: string
 *           format: date-time
 *           description: The date and time when the branch was last modified
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the branch was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the branch was last updated
 *       required:
 *         - branch_id
 *         - project_id
 *         - name
 *       example:
 *         branch_id: 1
 *         project_id: 100
 *         name: "main"
 *         last_modified: "2023-10-01T12:34:56Z"
 *         createdAt: "2023-10-01T12:34:56Z"
 *         updatedAt: "2023-10-01T12:34:56Z"
 */

const Branch = sequelize.define('Branch',{ 
    branch_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    project_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    last_modified:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW

    }
 },
    {
        tableName: 'Branch',
        schema: 'public',
        timestamps: true
    }
);

export default Branch;