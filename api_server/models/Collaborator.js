import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";


/**
 * @swagger
 * components:
 *   schemas:
 *     Collaborator:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: The unique identifier for the user (primary key)
 *         branch_id:
 *           type: integer
 *           description: The unique identifier for the branch (primary key)
 *         role:
 *           type: string
 *           description: The role of the user within the branch
 *         permissions:
 *           type: object
 *           description: The permissions associated with the user on the branch
 *           additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the collaborator record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the collaborator record was last updated
 *       required:
 *         - user_id
 *         - branch_id
 *       example:
 *         user_id: "12345"
 *         branch_id: 1
 *         role: "Developer"
 *         permissions: 
 *           {
 *             "read": true,
 *             "write": true,
 *             "admin": false
 *           }
 *         createdAt: "2023-10-01T12:34:56Z"
 *         updatedAt: "2023-10-01T12:34:56Z"
 */

const Collaborator = sequelize.define('Collaborator', {
    user_id: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    branch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    role: {
        type: DataTypes.STRING
    },
    permissions: {
        type: DataTypes.JSONB
    }
},
    {
        tableName: 'Collaborators',
        schema: 'public',
        timestamps: true
    }
);

export default Collaborator;