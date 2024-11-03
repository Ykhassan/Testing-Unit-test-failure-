CREATE TABLE "users" (
  "user_id" varchar(255) PRIMARY KEY,
  "username" varchar,
  "fullname" varchar,
  "email" varchar,
  "pass_hash" text,
  "profile_img_url" text,
  "last_login" timestamp,
  "created_at" timestamp,
  "bio" text,
  "is_active" boolean
);

CREATE TABLE "projects" (
  "project_id" serial PRIMARY KEY,
  "name" varchar,
  "description" text,
  "owner_id" varchar(255),
  "visibility" varchar,
  "created_at" timestamp,
  "last_updated" timestamp,
  "estimated_cost" numeric(12,6),
  "like_count" integer,
  "clone_count" integer,
  "blob_url" text,
  "availability" numeric(12,2),
  "durability" numeric(12,2),
  "cloud_provider" varchar,
  "commit_count" integer
);

CREATE TABLE "connections" (
  "connection_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "name" varchar,
  "cloud_provider" varchar,
  "last_updated" timestamp,
  "status" varchar,
  "details" JSONB
);

CREATE TABLE "tags" (
  "tag_id" serial PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "deployments" (
  "deployment_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "project_id" serial,
  "status" varchar,
  "cloud_provider" varchar,
  "date" timestamp,
  "version" varchar,
  "total_duration" interval,
  "connection_id" serial
);

CREATE TABLE "commits" (
  "commit_id" serial PRIMARY KEY,
  "msg" text,
  "date" timestamp,
  "branch_id" serial,
  "user_id" varchar(255),
  "hash" text,
  "url" text
);

CREATE TABLE "branches" (
  "branch_id" serial PRIMARY KEY,
  "name" varchar,
  "project_id" serial,
  "created_at" timestamp,
  "last_updated" timestamp
);

CREATE TABLE "collaborators" (
  "user_id" varchar(255),
  "branch_id" serial,
  "role" varchar,
  "collab_date" timestamp,
  "permissions" JSONB,
  PRIMARY KEY ("user_id", "branch_id")
);

CREATE TABLE "comments" (
  "comment_id" SERIAL PRIMARY KEY,
  "user_id" varchar(255),
  "content" text,
  "created_at" timestamp,
  "up_votes" integer,
  "down_votes" integer
);

CREATE TABLE "replies" (
  "comment_id" serial,
  "parent_comment_id" serial,
  PRIMARY KEY ("comment_id", "parent_comment_id")
);

CREATE TABLE "clones" (
  "project_id" serial,
  "clone_id" serial,
  PRIMARY KEY ("project_id", "clone_id")
);

CREATE TABLE "projects_tags" (
  "project_id" serial,
  "tag_id" serial,
  PRIMARY KEY ("project_id", "tag_id")
);

CREATE TABLE "issues" (
  "issue_id" serial PRIMARY KEY,
  "user_id" varchar(255),
  "project_id" serial,
  "title" text,
  "description" text,
  "status" varchar,
  "created_at" timestamp,
  "closed_at" timestamp
);

CREATE TABLE "issues_comments" (
  "issue_id" serial,
  "comment_id" serial,
  PRIMARY KEY ("issue_id", "comment_id")
);

CREATE TABLE "projects_comments" (
  "project_id" serial,
  "comment_id" serial,
  PRIMARY KEY ("project_id", "comment_id")
);

ALTER TABLE "projects" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("user_id");

ALTER TABLE "connections" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "deployments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "deployments" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id");

ALTER TABLE "deployments" ADD FOREIGN KEY ("connection_id") REFERENCES "connections" ("connection_id");

ALTER TABLE "commits" ADD FOREIGN KEY ("branch_id") REFERENCES "branches" ("branch_id");

ALTER TABLE "commits" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "branches" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id");

ALTER TABLE "collaborators" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "collaborators" ADD FOREIGN KEY ("branch_id") REFERENCES "branches" ("branch_id");

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "replies" ADD FOREIGN KEY ("comment_id") REFERENCES "comments" ("comment_id");

ALTER TABLE "replies" ADD FOREIGN KEY ("parent_comment_id") REFERENCES "comments" ("comment_id");

ALTER TABLE "clones" ADD FOREIGN KEY ("clone_id") REFERENCES "projects" ("project_id");

ALTER TABLE "clones" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id");

ALTER TABLE "projects_tags" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id");

ALTER TABLE "projects_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("tag_id");

ALTER TABLE "issues" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "issues" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id");

ALTER TABLE "issues_comments" ADD FOREIGN KEY ("issue_id") REFERENCES "issues" ("issue_id");

ALTER TABLE "issues_comments" ADD FOREIGN KEY ("comment_id") REFERENCES "comments" ("comment_id");

ALTER TABLE "projects_comments" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id");

ALTER TABLE "projects_comments" ADD FOREIGN KEY ("comment_id") REFERENCES "comments" ("comment_id");
