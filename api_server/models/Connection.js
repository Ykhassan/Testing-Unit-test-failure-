import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

// CREATE TABLE "Connections" (
//     "connection_id" serial PRIMARY KEY,
//     "user_id" varchar(255),
//     "name" varchar NOT NULL,
//     "cloud_provider" varchar NOT NULL,
//     "status" varchar,
//     "details" JSONB,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
//   );

/**
 * @swagger
 * components:
 *   schemas:
 *     Connection:
 *       type: object
 *       properties:
 *         connection_id:
 *           type: integer
 *           description: The unique identifier for the connection
 *         user_id:
 *           type: string
 *           description: The ID of the user who owns the connection
 *         name:
 *           type: string
 *           description: The name of the connection
 *         cloud_provider:
 *           type: string
 *           description: The cloud provider for the connection
 *         status:
 *           type: string
 *           description: The status of the connection
 *         details:
 *           type: object
 *           description: Additional details about the connection
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the connection was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the connection was last updated
 *       required:
 *         - connection_id
 *         - user_id
 *         - name
 *         - cloud_provider
 *       example:
 *         connection_id: 1
 *         user_id: "user123"
 *         name: "My Connection"
 *         cloud_provider: "AWS"
 *         status: "active"
 *         details: { "region": "us-west-2" }
 *         createdAt: "2023-10-01T12:34:56Z"
 *         updatedAt: "2023-10-01T12:34:56Z"
 */
const Connection = sequelize.define('Connection', {
    connection_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cloud_provider: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
    },
    details: {
        type: DataTypes.JSONB
    }
}, {
    tableName: 'Connections',
    schema: 'public',
    timestamps: true
});

export default Connection;