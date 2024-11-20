-- createdAt and updatedAt are managed by Sequelize

CREATE TABLE "Users" (
  "user_id" varchar(255) PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "fullname" varchar NOT NULL,
  "email" varchar NOT NULL,
  "profile_img_url" text,
  "bio" text,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Connections" (
  "connection_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "name" varchar NOT NULL,
  "cloud_provider" varchar NOT NULL,
  "status" varchar,
  "details" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
);

CREATE TABLE "Projects" (
  "project_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "name" varchar NOT NULL,
  "description" text,
  "visibility" varchar,
  "estimated_cost" numeric(12,6) DEFAULT 0.00,
  "availability" numeric(12,2) DEFAULT 0.00,
  "durability" numeric(12,2) DEFAULT 0.00,
  "cloud_provider" varchar,
  "like_count" integer DEFAULT 0,
  "blob_url" text,
  "last_modified" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
);

CREATE TABLE "Tags" (
  "tag_id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Deployments" (
  "deployment_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "project_id" serial,
  "status" varchar,
  "cloud_provider" varchar,
  "version" varchar,
  "total_duration" interval,
  "connection_id" serial,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id"),
  FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id"),
  FOREIGN KEY ("connection_id") REFERENCES "Connections" ("connection_id")
);

CREATE TABLE "Branches" (
  "branch_id" serial PRIMARY KEY,
  "project_id" serial,
  "name" varchar NOT NULL,
  "last_modified" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id")
);

CREATE TABLE "Commits" (
  "commit_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "branch_id" serial,
  "msg" text,
  "hash" text,
  "url" text,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("branch_id") REFERENCES "Branches" ("branch_id"),
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
);

CREATE TABLE "Collaborators" (
  "user_id" varchar(255),
  "branch_id" serial,
  "role" varchar,
  "permissions" JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "branch_id"),
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id"),
  FOREIGN KEY ("branch_id") REFERENCES "Branches" ("branch_id")
);

CREATE TABLE "Comments" (
  "comment_id" SERIAL PRIMARY KEY,
  "user_id" varchar(255),
  "content" text NOT NULL,
  "up_votes" integer DEFAULT 0,
  "down_votes" integer DEFAULT 0,
  "last_modified" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
);

CREATE TABLE "Issues" (
  "issue_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "project_id" serial,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "status" varchar,
  "closed_at" timestamp,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id"),
  FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id")
);

CREATE TABLE "Replies" (
  "comment_id" serial UNIQUE,
  "parent_comment_id" serial,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("comment_id", "parent_comment_id"),
  FOREIGN KEY ("comment_id") REFERENCES "Comments" ("comment_id"),
  FOREIGN KEY ("parent_comment_id") REFERENCES "Comments" ("comment_id")
);

CREATE TABLE "Clones" (
  "project_id" serial UNIQUE,
  "parent_project_id" serial,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("project_id", "parent_project_id"),
  FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id"),
  FOREIGN KEY ("parent_project_id") REFERENCES "Projects" ("project_id")
);

CREATE TABLE "Projects_tags" (
  "project_id" serial,
  "tag_id" serial,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("project_id", "tag_id"),
  FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id"),
  FOREIGN KEY ("tag_id") REFERENCES "Tags" ("tag_id")
);

CREATE TABLE "Issues_comments" (
  "issue_id" serial,
  "comment_id" serial,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("issue_id", "comment_id"),
  FOREIGN KEY ("issue_id") REFERENCES "Issues" ("issue_id"),
  FOREIGN KEY ("comment_id") REFERENCES "Comments" ("comment_id")
);

CREATE TABLE "Projects_comments" (
  "project_id" serial,
  "comment_id" serial,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("project_id", "comment_id"),
  FOREIGN KEY ("project_id") REFERENCES "Projects" ("project_id"),
  FOREIGN KEY ("comment_id") REFERENCES "Comments" ("comment_id")
);