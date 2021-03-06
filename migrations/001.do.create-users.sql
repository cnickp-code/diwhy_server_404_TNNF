CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    endorsements INT DEFAULT 0 NOT NULL,
    intro BOOLEAN DEFAULT FALSE NOT NULL,
    profile_pic TEXT DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    date_modified TIMESTAMPTZ
);