CREATE DATABASE "san11-platform-db";
GRANT ALL PRIVILEGES ON DATABASE "san11-platform-db" TO postgres;
\c "san11-platform-db";

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
INSERT INTO categories VALUES (DEFAULT, 'SIRE Plugin');
INSERT INTO categories VALUES (DEFAULT, 'Player tool');
INSERT INTO categories VALUES (DEFAULT, 'Mod Maker tool');


CREATE TABLE binaries (
    binary_id INT NOT NULL,
    package_id INT NOT NULL,
    url TEXT, /*DEPRECATED*/
    download_count INT DEFAULT 0,
    version TEXT NOT NULL,
    description TEXT NOT NULL,
    create_time TIMESTAMP,
    tag TEXT,
    download_method TEXT,
    size TEXT,
    name TEXT,

    PRIMARY KEY (binary_id, package_id, create_time)
);

CREATE TABLE users (
    user_id INT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    user_type TEXT NOT NULL,
    create_timestamp TIMESTAMP,
    image_url TEXT,
    website TEXT,
    name TEXT,

    PRIMARY KEY (user_id, create_timestamp)
);
INSERT INTO users VALUES (DEFAULT, 'admin', 'admin', 'a@a.com', 'admin', current_timestamp, NULL, NULL);
INSERT INTO users VALUES (DEFAULT, 'yong', 'yong', 'a@a.com', 'regular', current_timestamp, NULL, NULL);

CREATE TABLE sessions (
    sid TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(user_id),
    expiration BIGINT NOT NULL
);

CREATE TABLE packages (
    package_id INT NOT NULL,
    package_name TEXT NOT NULL,
    description TEXT NOT NULL,
    create_time TIMESTAMP,
    category_id INT NOT NULL REFERENCES categories(category_id),
    status INT NOT NULL,
    author_id INT NOT NULL REFERENCES users(user_id),
    image_urls TEXT[],
    download_count INT DEFAULT 0,
    tag_ids INT[],
    update_time TIMESTAMP,
    name TEXT,

    PRIMARY KEY (category_id, package_id, create_time)
);
-- INSERT INTO packages VALUES (DEFAULT, '【测试】战争迷雾', '提供战争迷雾。城市，关港5格范围内提供视野。城塞2格范围内提供视野', current_timestamp, 1, 1, 1, NULL, 0, NULL, current_timestamp);
-- INSERT INTO packages VALUES (DEFAULT, '【测试】战法连携', '战法可以互相触发。顺序 枪 戟 弩', current_timestamp, 1, 1, 1, NULL, 0, NULL, current_timestamp);
-- INSERT INTO packages VALUES (DEFAULT, '【测试】功绩解锁特解', '随着功绩提升可以解锁新的特级 功绩等级 10000， 20000， 30000', current_timestamp, 1, 1, 1, NULL, 0, NULL, current_timestamp);
-- INSERT INTO packages VALUES (DEFAULT, '【测试】AI不攻击关港', 'n/a', current_timestamp, 1, 1, 1, NULL, 0, NULL, current_timestamp);
-- INSERT INTO packages VALUES (DEFAULT, '【测试】小兵系统', '自动拔擢小兵成为武将', current_timestamp, 1, 1, 1, NULL, 0, NULL, current_timestamp);
-- INSERT INTO packages VALUES (DEFAULT, '【测试】UI现实粮草', '', current_timestamp, 1, 1, 1, NULL, 0, NULL, current_timestamp);

CREATE TABLE statistics (
    date DATE NOT NULL,
    visit_count INT DEFAULT 0,
    download_count INT DEFAULT 0,

    PRIMARY KEY (date)
);

CREATE TABLE comments (
    parent TEXT NOT NULL,
    comment_id INT NOT NULL,
    create_time TIMESTAMP NOT NULL,
    update_time TIMESTAMP,
    text TEXT NOT NULL,
    author_id INT NOT NULL,
    upvote_count INT DEFAULT 0,
    name TEXT,

    PRIMARY KEY (comment_id)
);

CREATE TABLE replies (
    comment_id INT NOT NULL,
    reply_id INT NOT NULL,
    create_time TIMESTAMP NOT NULL,
    update_time TIMESTAMP,
    text TEXT NOT NULL,
    author_id INT NOT NULL,
    upvote_count INT DEFAULT 0,
    name TEXT,

    PRIMARY KEY (comment_id, reply_id)
);

CREATE TABLE activities (
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    create_time TIMESTAMP,
    action INT NOT NULL,
    resource_name TEXT NOT NULL,

    PRIMARY KEY (activity_id, user_id, create_time, resource_name)
);

CREATE TABLE tags (
    tag_id INT NOT NULL,
    tag_name TEXT NOT NULL,
    category_id INT NOT NULL,
    mutable BOOLEAN NOT NULL,
    name TEXT, 

    PRIMARY KEY (name, category_id)
);

CREATE TABLE verification_codes (
    email TEXT NOT NULL,
    code TEXT NOT NULL,

    PRIMARY KEY (email)
);

\dt;
