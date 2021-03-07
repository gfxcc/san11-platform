CREATE DATABASE "san11-platform-db";
GRANT ALL PRIVILEGES ON DATABASE "san11-platform-db" TO postgres;
\c "san11-platform-db";

CREATE TABLE primary_categories (
    category_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
INSERT INTO primary_categories VALUES (DEFAULT, 'SIRE2 Plugin');
INSERT INTO primary_categories VALUES (DEFAULT, 'Player tool');
INSERT INTO primary_categories VALUES (DEFAULT, 'Mod Maker tool');

CREATE TABLE secondary_categories (
    category_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
INSERT INTO secondary_categories VALUES (DEFAULT, '默认');

CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    data BYTEA NOT NULL
);

CREATE TABLE binaries (
    binary_id SERIAL PRIMARY KEY,
    download_count INT DEFAULT 0,
    version TEXT NOT NULL,
    description TEXT NOT NULL,
    data BYTEA NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    user_type TEXT NOT NULL,
    image_id INT REFERENCES images(image_id)
);
INSERT INTO users VALUES (DEFAULT, 'admin', 'admin', 'a@a.com', 'admin', NULL);
INSERT INTO users VALUES (DEFAULT, 'yong', 'yong', 'a@a.com', 'regular', NULL);

CREATE TABLE sessions (
    sid TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(user_id),
    expiration BIGINT NOT NULL
);

CREATE TABLE packages (
    package_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    primary_category_id INT NOT NULL REFERENCES primary_categories(category_id),
    secondary_category_id INT REFERENCES secondary_categories(category_id),
    status TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES users(user_id),
    binary_ids INT[],
    image_ids INT[]
);
INSERT INTO packages VALUES (DEFAULT, '战争迷雾', '提供战争迷雾。城市，关港5格范围内提供视野。城塞2格范围内提供视野', 1, 1, 'normal', 1, NULL, NULL);
INSERT INTO packages VALUES (DEFAULT, '战法连携', '战法可以互相触发。顺序 枪 戟 弩', 1, 1, 'normal', 1, NULL, NULL);
INSERT INTO packages VALUES (DEFAULT, '功绩解锁特解', '随着功绩提升可以解锁新的特级 功绩等级 10000， 20000， 30000', 1, 1, 'normal', 1, NULL, NULL);
INSERT INTO packages VALUES (DEFAULT, 'AI不攻击关港', 'n/a', 1, 1, 'normal', 1, NULL, NULL);
INSERT INTO packages VALUES (DEFAULT, '小兵系统', '自动拔擢小兵成为武将', 1, 1, 'normal', 1, NULL, NULL);
INSERT INTO packages VALUES (DEFAULT, 'UI现实粮草', '', 1, 1, 'normal', 1, NULL, NULL);

\dt;
