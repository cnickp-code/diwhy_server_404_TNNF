BEGIN;

TRUNCATE
    users,
    categories,
    users_interests,
    threads,
    comments,
    postings,
    posting_applicants,
    likes
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, email, password)
VALUES
    ('Swaggatha', 'test@test.com', '$2a$12$nEuCrDTcCPllpYUAXoTHXudUicbfPFyYdfDonimIK./3tfivD7PrO');

-- INSERT INTO users_interests (user_id, category_id)
-- VALUES 
--     (1, 1),
--     (1, 2),
--     (1, 6),
--     (1, 7);

INSERT INTO categories(name)
VALUES
    ('Woodworking'),
    ('Metalworking'),
    ('Needlecraft'),
    ('Automotive'),
    ('Home Improvement'),
    ('General Crafts'),
    ('Electronics'),
    ('Outdoorsmanship');

INSERT INTO threads (title, user_id, category, date_created, content)
VALUES
    ('Test Thread 1', 1, 1, '2029-01-22T16:28:32.615Z', 'Test Content');

INSERT INTO comments (user_id, thread_id, date_created, content)
VALUES
    (1, 1, '2029-01-22T16:28:32.615Z', 'Test Content');

INSERT INTO postings (title, user_id, category, date_created, content)
VALUES
    ('Test Posting 1', 1, 1, '2029-01-22T16:28:32.615Z', 'Test Content');

COMMIT;