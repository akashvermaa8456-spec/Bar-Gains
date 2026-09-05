-- supabase/seeds.sql
-- Demo / seed data for Phase 2
-- WARNING: This data is sample/demo only. Clearly label and replace in production.

-- Insert sample internships
INSERT INTO public.internships (slug, title, short_description, description, duration, level, technologies, curriculum, learning_outcomes, assignments, project, price, published)
VALUES
('java-development', 'Java Development', 'Core Java, object-oriented design, and backend fundamentals through guided assignments.', 'A structured internship-style program focused on writing maintainable Java, understanding core APIs, and delivering a small backend project.', '8 weeks', 'Beginner', ARRAY['Java','Maven','JUnit','SQL','Git'], ARRAY['Java syntax, types, and control flow','OOP, collections, and exception handling','File I/O and basic concurrency concepts','SQL and connecting Java to a database','Testing with JUnit and using Git','Capstone: a small service with documented APIs'], ARRAY['Write readable Java modules with clear package structure','Model data with classes and collections','Persist and query data with SQL','Test core logic and track work in Git'], ARRAY['Console applications and data-structure drills','A CRUD layer against a sample schema','Unit tests for business rules'], 'Build a documented Java service (for example, a catalogue or booking helper) with tests and a README.', '₹XX,XXX (placeholder — confirm before enrolment)', true),
('full-stack-development', 'Full Stack Development', 'Front-end interfaces plus a simple backend, shipped as one coherent project.', 'Students practise HTML/CSS/TypeScript on the client and a straightforward API on the server. The goal is one working full-stack application, not a survey of every framework.', '12 weeks', 'Intermediate', ARRAY['TypeScript','React','Node.js','PostgreSQL','Git'], ARRAY['Web fundamentals and accessible UI','Component-driven front ends','REST APIs and validation','Relational data modelling','Auth concepts (session vs token) at a high level','Deploying a demo to a free host'], ARRAY['Ship a responsive UI with clear information architecture','Design simple APIs and persist data','Document setup so another developer can run the project'], ARRAY['UI slices','API endpoints with validation','Database migrations for a small schema'], 'A full-stack sample product (for example, a program catalogue) marked as a learning project.', '₹XX,XXX (placeholder — confirm before enrolment)', true),
('python-development', 'Python Development', 'Python for scripting, APIs, and clean project structure.', 'Covers idiomatic Python, packaging a small application, and using the language for automation and web APIs.', '8 weeks', 'Beginner', ARRAY['Python','FastAPI','pytest','SQL','Git'], ARRAY['Python data types, functions, and modules','Virtual environments and packaging','HTTP APIs with FastAPI','Testing with pytest','Working with files and APIs'], ARRAY['Organise a Python project with a clear layout','Expose a small HTTP API','Write tests for core functions'], ARRAY['CLI utilities','API endpoints','Test suites for parsing and validation'], 'A Python API or automation tool with tests and usage notes.', '₹XX,XXX (placeholder — confirm before enrolment)', true)
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO public.courses (slug, title, short_description, description, duration, level, technologies, curriculum, modules, learning_outcomes, price, published)
VALUES
('java-programming','Java Programming','Core Java fundamentals','Learn Java syntax and core libraries.', '6 weeks','Beginner', ARRAY['Java'], ARRAY['Basics','OOP','Collections','I/O'], ARRAY['Module 1','Module 2'], ARRAY['Understand Java basics'], '₹X,XXX', true),
('full-stack','Full Stack Development','Front-end and backend fundamentals','A short course for building full-stack apps.','10 weeks','Intermediate', ARRAY['TypeScript','React','Node.js'], ARRAY['HTML/CSS','React basics','APIs'], ARRAY['Frontend module','Backend module'], ARRAY['Ship a small app'], '₹XX,XXX', true)
ON CONFLICT DO NOTHING;

-- Insert sample projects (marked as demo)
INSERT INTO public.projects (slug, title, description, technologies, category, demo, url, published)
VALUES
('sample-catalogue','Sample Product Catalogue','A demo catalogue app used as a learning project.', ARRAY['React','TypeScript','Postgres'], 'Web App', true, 'https://example.com/demo-catalogue', true),
('data-analytics-demo','Data Analytics Demo','A demo analytics notebook and dashboard (sample project).', ARRAY['Python','pandas','SQL'], 'Analytics', true, NULL, true)
ON CONFLICT DO NOTHING;

-- Note: no admin profile created here because Supabase Auth is the source of truth for user identities.
-- Create a profile row AFTER creating an auth user: INSERT INTO public.profiles (id, full_name, email, role) VALUES ('<auth-uid-uuid>', 'Admin Name', 'admin@example.com', 'ADMIN');

-- End of seeds
