-- ----Let's create tables for managing events in this database----

-- tables are
-- Users Talble
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  city VARCHAR(100),
  created_by INT NOT NULL,
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) 
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- RSVPs Table
CREATE TABLE rsvps (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  status VARCHAR(10) DEFAULT 'Maybe' CHECK (status IN ('Yes', 'No', 'Maybe')),
  CONSTRAINT fk_rsvp_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_rsvp_event FOREIGN KEY (event_id)
    REFERENCES events(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_rsvp UNIQUE (user_id, event_id)
);


-- ----Lets insert data - (10 users, 5 events, 20 RSVPs)----
-- Insert Users data
INSERT INTO users (name, email) VALUES 
('Aarav Sharma', 'aarav@example.com'), 
('Ishita Reddy', 'ishita@example.com'),
('Rohan Mehta', 'rohan@example.com'),
('Sneha Kapoor', 'sneha@example.com'),
('Vikram Das', 'vikram@example.com'),
('Meera Nair', 'meera@example.com'),
('Aditya Rao', 'aditya@example.com'),
('Priya Iyer', 'priya@example.com'),
('Karan Singh', 'karan@example.com'),
('Neha Gupta', 'neha@example.com');

-- Insert events data
INSERT INTO events (title, description, date, city, created_by) VALUES 
('Tech Meetup',   'A meetup for tech enthusiasts.',         '2025-09-05', 'Hyderabad', 1),
('Startup Pitch', 'Startup founders pitch their ideas.',    '2025-09-10', 'Bengaluru', 2),
('AI Workshop',   'Hands-on AI learning.',                  '2025-09-15', 'Chennai',   3),
('Music Festival','Live music and fun.',                    '2025-09-20', 'Hyderabad', 4),
('Hackathon',     '24-hour coding challenge.',              '2025-09-25', 'Bengaluru', 5);

-- Insert rsvps data
INSERT INTO rsvps (user_id, event_id, status) VALUES 
-- Event 1
(1, 1, 'Yes'),
(2, 1, 'Maybe'),
(3, 1, 'No'),
(4, 1, 'Yes'),
(5, 1, 'Yes'),
-- Event 2
(6, 2, 'Yes'),
(7, 2, 'Maybe'),
(8, 2, 'No'),
(9, 2, 'Yes'),
(10, 2, 'Yes'),
-- Event 3
(1, 3, 'Maybe'),
(2, 3, 'Yes'),
(3, 3, 'Yes'),
(4, 3, 'No'),
(5, 3, 'Yes'),
-- Event 4
(6, 4, 'Yes'),
(7, 4, 'No'),
(8, 4, 'Yes'),
-- Event 5
(9, 5, 'Maybe'),
(10, 5, 'Yes');


-- Lets do test 
SELECT * FROM users;

-- Counts rows of each table
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'rsvps', COUNT(*) FROM rsvps;

-- upcoming events
SELECT * FROM events
WHERE date >= CURRENT_DATE
ORDER BY date;

-- RSVPs with names (using joins)
SELECT r.id AS rsvp_id, u.name AS user_name, e.title AS event_title, r.status
FROM rsvps r
JOIN events e ON r.event_id = e.id
JOIN users u ON r.user_id = u.id
ORDER BY e.date, e.title, u.name;

-- RSVP summary per event (grouped)
SELECT e.title, r.status, COUNT(*) AS responses
FROM rsvps r
JOIN events e ON r.event_id = e.id
GROUP BY e.title, r.status
ORDER BY e.title, r.status;


-- -----Lets test some constraints----
-- Unique constraint test: duplicate RSVP
INSERT INTO rsvps (user_id, event_id, status)
VALUES (1, 1, 'Yes');  -- Duplicate of an existing row above
-- EXPECTED: ERROR due to CONSTRAINT unique_rsvp

-- Foreign key test: user does not exist
INSERT INTO rsvps (user_id, event_id, status)
VALUES (9999, 1, 'Yes'); -- user_id 9999 doesn't exist
-- EXPECTED: ERROR due to fk_rsvp_user

-- same for Foreign key test: event does not exist 
/*INSERT INTO rsvps (user_id, event_id, status)
VALUES (1, 9999, 'Yes'); -- event_id 9999 doesn't exist
-- EXPECTED: ERROR due to fk_rsvp_event
*/


-- ---- CASCADE DELETE DEMO (safe, no errors) ----
-- This shows ON DELETE CASCADE working across users -> events -> rsvps
WITH new_user AS (
  INSERT INTO users (name, email)
  VALUES ('Temp User', 'tempuser@example.com')
  RETURNING id
),
new_event AS (
  INSERT INTO events (title, description, date, city, created_by)
  SELECT 'Temp Event', 'Cascade test event', '2025-12-31', 'TestCity', id
  FROM new_user
  RETURNING id, created_by
)
INSERT INTO rsvps (user_id, event_id, status)
SELECT ne.created_by, ne.id, 'Yes' FROM new_event ne;

-- Show the temp rows exist
SELECT
  u.id   AS temp_user_id,
  e.id   AS temp_event_id,
  r.id   AS temp_rsvp_id,
  u.email,
  e.title,
  r.status
FROM users u
JOIN events e ON e.created_by = u.id AND e.title = 'Temp Event'
JOIN rsvps  r ON r.user_id = u.id AND r.event_id = e.id
WHERE u.email = 'tempuser@example.com';

-- Delete the temp user -> should cascade delete event and rsvp 
DELETE FROM users WHERE email = 'tempuser@example.com';

-- Lets check (should return 0 rows)
SELECT *
FROM rsvps r
JOIN events e ON r.event_id = e.id
WHERE e.title = 'Temp Event';

