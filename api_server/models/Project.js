import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         project_id:
 *           type: integer
 *           description: The unique identifier for the project.
 *         user_id:
 *           type: string
 *           description: The ID of the owner of the project.
 *         name:
 *           type: string
 *           description: The name of the project.
 *         description:
 *           type: string
 *           description: A detailed description of the project.
 *         visibility:
 *           type: string
 *           description: The visibility status of the project.
 *         estimated_cost:
 *           type: number
 *           format: decimal
 *           description: The estimated cost of the project.
 *         availability:
 *           type: number
 *           format: decimal
 *           description: The availability of the project.
 *         durability:
 *           type: number
 *           format: decimal
 *           description: The durability of the project.
 *         cloud_provider:
 *           type: string
 *           description: The cloud provider for the project.
 *         like_count:
 *           type: integer
 *           description: The number of likes for the project.
 *         blob_url:
 *           type: string
 *           description: The URL of the blob storage.
 *         last_modified:
 *           type: string
 *           format: date-time
 *           description: The date and time when the project was last modified.
 *       required:
 *         - project_id
 *         - user_id
 *         - name
 *       example:
 *         project_id: 1
 *         user_id: "user123"
 *         name: "My Project"
 *         description: "This is a sample project."
 *         visibility: "public"
 *         estimated_cost: 1000.00
 *         availability: 99.99
 *         durability: 99.99
 *         cloud_provider: "AWS"
 *         like_count: 10
 *         blob_url: "http://example.com/blob"
 *         last_modified: "2023-10-01T12:00:00Z"
 */
const Project = sequelize.define('Project', {
    project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    visibility: {
        type: DataTypes.STRING,
    },
    estimated_cost: {
        type: DataTypes.DECIMAL(12, 6),
        defaultValue: 0.00
    },
    availability: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    durability: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    cloud_provider: {
        type: DataTypes.STRING,
    },
    like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    blob_url: {
        type: DataTypes.TEXT,
    },
    last_modified: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
    {
        tableName: 'Projects',
        schema: 'public',
        timestamps: true
    }
);

export default Project;