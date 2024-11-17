CREATE TABLE "Users" (
  "user_id" varchar(255) PRIMARY KEY,
  "username" varchar,
  "fullname" varchar,
  "email" varchar,
  "profile_img_url" text,
  "last_login" timestamp,
  "created_at" timestamp,
  "bio" text,
  "is_active" boolean
);

CREATE TABLE "Projects" (
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
  "commit_count" integer,
  FOREIGN KEY ("owner_id") REFERENCES "Users" ("user_id")
);