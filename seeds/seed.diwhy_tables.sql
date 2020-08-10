BEGIN;

TRUNCATE
    users,
    categories,
    users_interests,
    threads,
    comments,
    postings,
    posting_applicants
    RESTART IDENTITY CASCADE;

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

COMMIT;