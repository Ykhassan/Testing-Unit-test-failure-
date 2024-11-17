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
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the project.
 *           example: "My Project"
 *         description:
 *           type: string
 *           description: A detailed description of the project.
 *           example: "This is a sample project."
 *         owner_id:
 *           type: string
 *           description: The ID of the owner of the project.
 *           example: "user123"
 *         visibility:
 *           type: string
 *           description: The visibility status of the project.
 *           example: "public"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the project was created.
 *           example: "2023-01-01T00:00:00Z"
 *         last_updated:
 *           type: string
 *           format: date-time
 *           description: The date and time when the project was last updated.
 *           example: "2023-01-02T00:00:00Z"
 *         estimated_cost:
 *           type: number
 *           format: decimal
 *           description: The estimated cost of the project.
 *           example: 12345.678901
 *         like_count:
 *           type: integer
 *           description: The number of likes the project has received.
 *           example: 100
 *         clone_count:
 *           type: integer
 *           description: The number of times the project has been cloned.
 *           example: 50
 *         blob_url:
 *           type: string
 *           description: The URL to the project's blob storage.
 *           example: "http://example.com/blob"
 *         availability:
 *           type: number
 *           format: decimal
 *           description: The availability percentage of the project.
 *           example: 99.99
 *         durability:
 *           type: number
 *           format: decimal
 *           description: The durability percentage of the project.
 *           example: 99.99
 *         cloud_provider:
 *           type: string
 *           description: The cloud provider for the project.
 *           example: "AWS"
 *         commit_count:
 *           type: integer
 *           description: The number of commits made to the project.
 *           example: 200
 */
const Project = sequelize.define('Project', {
    project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    owner_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    visibility: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    last_updated: {
        type: DataTypes.DATE,
    },
    estimated_cost: {
        type: DataTypes.DECIMAL(12, 6),
    },
    like_count: {
        type: DataTypes.INTEGER,
    },
    clone_count: {
        type: DataTypes.INTEGER,
    },
    blob_url: {
        type: DataTypes.TEXT,
    },
    availability: {
        type: DataTypes.DECIMAL(12, 2),
    },
    durability: {
        type: DataTypes.DECIMAL(12, 2),
    },
    cloud_provider: {
        type: DataTypes.STRING(255),
    },
    commit_count: {
        type: DataTypes.INTEGER,
    },
},
    {
        tableName: 'Project',
        schema: 'public',
        timestamps: false
    }
);

export default Project;