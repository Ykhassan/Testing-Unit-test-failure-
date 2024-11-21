import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";
import Connection from "./Connection.js";


/**
 * @swagger
 * components:
 *   schemas:
 *     Deployment:
 *       type: object
 *       properties:
 *         deployment_id:
 *           type: integer
 *           description: The unique identifier for the deployment
 *         user_id:
 *           type: string
 *           description: The unique identifier of the user who initiated the deployment
 *         project_id:
 *           type: integer
 *           description: The identifier of the project being deployed
 *         status:
 *           type: string
 *           description: The current status of the deployment (e.g., in-progress, completed)
 *         cloud_provider:
 *           type: string
 *           description: The cloud provider where the deployment is made (e.g., AWS, Azure)
 *         version:
 *           type: string
 *           description: The version of the deployed project
 *         total_duration:
 *           type: string
 *           description: The total duration of the deployment, stored as a string (e.g., "5 hours")
 *         Connection_id:
 *           type: integer
 *           description: The identifier for the connection used during the deployment
 *       required:
 *         - user_id
 *         - project_id
 *         - status
 *         - cloud_provider
 *         - version
 *       example:
 *         deployment_id: 1
 *         user_id: "12345"
 *         project_id: 101
 *         status: "completed"
 *         cloud_provider: "AWS"
 *         version: "1.2.3"
 *         total_duration: "5 hours"
 *         Connection_id: 10
 */

// DB tables
// CREATE TABLE "Deployments" (
//     "deployment_id" serial PRIMARY KEY,
//     "user_id" varchar(255),
//     "project_id" serial,
//     "status" varchar,
//     "cloud_provider" varchar,
//     "version" varchar,
//     "total_duration" interval,
//     "connection_id" serial,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id"),
//     FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id"),
//     FOREIGN KEY ("connection_id") REFERENCES "Connections" ("connection_id")
//   );

const Deployment = sequelize.define('Deployment',
    {
        deployment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING
        },
        project_id: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING
        },
        cloud_provider: {
            type: DataTypes.STRING
        },
        version: {
            type: DataTypes.STRING
        },
        // seqeulize doesn't support INTERVAL datatypes natively therefore, we store them as String/varchar() and use raw SQL query
        total_duration: {
            type: DataTypes.STRING
        },
        connection_id: {
            type: DataTypes.INTEGER
        },
    },
    {
        tableName: 'Deployments',
        schema: 'public',
        timestamps: true
    }
);

export default Deployment;