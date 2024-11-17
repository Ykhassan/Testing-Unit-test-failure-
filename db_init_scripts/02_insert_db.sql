-- Insert statements for the "Users" table
INSERT INTO "Users" ("user_id", "username", "fullname", "email", "profile_img_url", "last_login", "created_at", "bio", "is_active") VALUES
('u1', 'jdoe', 'John Doe', 'jdoe@example.com', 'http://example.com/img1.jpg', '2024-11-16 12:00:00', '2024-11-16 09:00:00', 'Bio for John Doe', true),
('u2', 'asmith', 'Alice Smith', 'asmith@example.com', 'http://example.com/img2.jpg', '2024-11-16 13:00:00', '2024-11-16 10:00:00', 'Bio for Alice Smith', true),
('u3', 'bjohnson', 'Bob Johnson', 'bjohnson@example.com', 'http://example.com/img3.jpg', '2024-11-16 14:00:00', '2024-11-16 11:00:00', 'Bio for Bob Johnson', false),
('u4', 'cmiller', 'Carol Miller', 'cmiller@example.com', 'http://example.com/img4.jpg', '2024-11-16 15:00:00', '2024-11-16 12:00:00', 'Bio for Carol Miller', true),
('u5', 'dlee', 'David Lee', 'dlee@example.com', 'http://example.com/img5.jpg', '2024-11-16 16:00:00', '2024-11-16 13:00:00', 'Bio for David Lee', false);

-- Insert statements for the "Projects" table
INSERT INTO "Projects" ("name", "description", "owner_id", "visibility", "created_at", "last_updated", "estimated_cost", "like_count", "clone_count", "blob_url", "availability", "durability", "cloud_provider", "commit_count") VALUES
('Project Alpha', 'Description for Project Alpha', 'u1', 'public', '2024-11-16 12:00:00', '2024-11-16 13:00:00', 1000.00, 10, 5, 'http://example.com/blob1', 99.99, 99.99, 'AWS', 50),
('Project Beta', 'Description for Project Beta', 'u2', 'private', '2024-11-16 14:00:00', '2024-11-16 15:00:00', 2000.00, 20, 10, 'http://example.com/blob2', 99.98, 99.98, 'Azure', 100),
('Project Gamma', 'Description for Project Gamma', 'u3', 'public', '2024-11-16 16:00:00', '2024-11-16 17:00:00', 3000.00, 30, 15, 'http://example.com/blob3', 99.97, 99.97, 'GCP', 150),
('Project Delta', 'Description for Project Delta', 'u4', 'private', '2024-11-16 18:00:00', '2024-11-16 19:00:00', 4000.00, 40, 20, 'http://example.com/blob4', 99.96, 99.96, 'AWS', 200),
('Project Epsilon', 'Description for Project Epsilon', 'u5', 'public', '2024-11-16 20:00:00', '2024-11-16 21:00:00', 5000.00, 50, 25, 'http://example.com/blob5', 99.95, 99.95, 'Azure', 250);