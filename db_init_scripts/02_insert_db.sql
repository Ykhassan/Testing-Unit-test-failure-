-- Insert statements for "Users" table
INSERT INTO "Users" ("user_id", "username", "fullname", "email", "profile_img_url", "bio") VALUES
('user_1', 'john_doe', 'John Doe', 'john.doe@example.com', 'https://azureblobstorage.com/john_doe.jpg', 'Software Developer at XYZ Corp.'),
('user_2', 'alice_smith', 'Alice Smith', 'alice.smith@example.com', 'https://azureblobstorage.com/alice_smith.jpg', 'Cloud Architect at ABC Inc.'),
('user_3', 'bob_jones', 'Bob Jones', 'bob.jones@example.com', 'https://azureblobstorage.com/bob_jones.jpg', 'DevOps Engineer at DEF Ltd.'),
('user_4', 'carol_white', 'Carol White', 'carol.white@example.com', 'https://azureblobstorage.com/carol_white.jpg', 'Data Scientist at GHI Co.'),
('user_5', 'david_lee', 'David Lee', 'david.lee@example.com', 'https://azureblobstorage.com/david_lee.jpg', 'Full Stack Developer at JKL LLC.');

-- Insert statements for "Connections" table
INSERT INTO "Connections" ("user_id", "name", "cloud_provider", "status", "details") VALUES
('user_1', 'AWS Connection', 'AWS', 'active', '{"region": "us-west-1"}'),
('user_2', 'Azure Connection', 'Azure', 'active', '{"region": "east-us"}'),
('user_3', 'GCP Connection', 'GCP', 'inactive', '{"region": "europe-west1"}'),
('user_4', 'AWS Connection', 'AWS', 'active', '{"region": "us-east-1"}'),
('user_5', 'Azure Connection', 'Azure', 'inactive', '{"region": "west-europe"}');

-- Insert statements for "Projects" table
INSERT INTO "Projects" ("user_id", "name", "description", "visibility", "estimated_cost", "availability", "durability", "cloud_provider", "like_count", "blob_url") VALUES
('user_1', 'Microservices Architecture', 'A project to implement a microservices architecture.', 'public', 5000.00, 99.99, 95.00, 'AWS', 100, 'https://azureblobstorage.com/microservices.jpg'),
('user_2', 'Serverless Architecture', 'A project to implement a serverless architecture.', 'private', 3000.00, 99.95, 90.00, 'Azure', 80, 'https://azureblobstorage.com/serverless.jpg'),
('user_3', '3-Tier Architecture', 'A project to implement a 3-tier architecture.', 'public', 7000.00, 99.90, 85.00, 'GCP', 120, 'https://azureblobstorage.com/3tier.jpg'),
('user_4', 'Dockerized Application', 'A project to containerize an application using Docker.', 'private', 4000.00, 99.85, 80.00, 'AWS', 90, 'https://azureblobstorage.com/docker.jpg'),
('user_5', 'Kubernetes Deployment', 'A project to deploy an application on Kubernetes.', 'public', 6000.00, 99.80, 75.00, 'Azure', 110, 'https://azureblobstorage.com/kubernetes.jpg');

-- Insert statements for "Tags" table
INSERT INTO "Tags" ("name") VALUES
('Microservices'),
('Serverless'),
('3-Tier'),
('Docker'),
('Kubernetes');

-- Insert statements for "Projects_tags" table
INSERT INTO "Projects_tags" ("project_id", "tag_id") VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert statements for "Deployments" table
INSERT INTO "Deployments" ("user_id", "project_id", "status", "cloud_provider", "version", "total_duration", "connection_id") VALUES
('user_1', 1, 'In Progress', 'AWS', 'v1.0', '5 hours', 1),
('user_2', 2, 'Completed', 'Azure', 'v2.1', '2 hours 30 minutes', 2),
('user_3', 3, 'Failed', 'GCP', 'v3.5', '1 hour 15 minutes', 3),
('user_4', 4, 'In Progress', 'AWS', 'v1.2', '6 hours 45 minutes', 4),
('user_5', 5, 'Completed', 'DigitalOcean', 'v4.0', '3 hours', 5);

-- Insert statements for "Comments" table
INSERT INTO "Comments" ("user_id", "content", "up_votes", "down_votes", "last_modified") VALUES
('user_1', 'This is a great post!', 15, 2, '2024-11-21 10:00:00'),
('user_2', 'I completely disagree with this.', 5, 20, '2024-11-21 11:30:00'),
('user_3', 'Could you elaborate more on this topic?', 8, 1, '2024-11-21 12:15:00'),
('user_4', 'Thanks for sharing!', 12, 0, '2024-11-21 13:45:00'),
('user_5', 'This information is outdated.', 3, 6, '2024-11-21 14:20:00');

-- Insert statements for "Issues" table
INSERT INTO "Issues" ("user_id", "project_id", "title", "description", "status", "closed_at") VALUES
('user_1', 1, 'Login Bug', 'Users are unable to log in to the system.', 'open', NULL),
('user_2', 2, 'UI Improvement', 'Update the project dashboard UI for better usability.', 'in-progress', NULL),
('user_3', 3, 'API Error', 'Error 500 occurs when fetching project details.', 'resolved', '2024-11-01 10:30:00'),
('user_4', 4, 'Database Optimization', 'Optimize the database queries for faster response times.', 'open', NULL),
('user_5', 5, 'Feature Request', 'Add a dark mode option for the application.', 'closed', '2024-10-15 14:45:00');

-- Insert statements for "Projects_comments" table
INSERT INTO "Projects_comments" ("project_id", "comment_id") VALUES
(1,6),
(1,7),
(1,8);
-- Insert statements for "Clones" table
INSERT INTO "Clones" ("project_id", "parent_project_id") VALUES
(2, 1),
(3, 1),
(4, 1);
