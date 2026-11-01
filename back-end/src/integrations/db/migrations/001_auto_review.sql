CREATE TABLE site_settings (
    singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
    package_auto_approval_enabled boolean NOT NULL DEFAULT false
);
INSERT INTO site_settings DEFAULT VALUES;

CREATE TABLE package_review_schedule (
    parent text NOT NULL,
    resource_id integer NOT NULL,
    approve_at timestamptz NOT NULL,
    PRIMARY KEY (parent, resource_id),
    FOREIGN KEY (parent, resource_id) REFERENCES packages(parent, resource_id) ON DELETE CASCADE
);
CREATE INDEX package_review_schedule_due ON package_review_schedule(approve_at);

CREATE TABLE site_settings_audit (
    id bigserial PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    actor text NOT NULL,
    action text NOT NULL,
    details jsonb NOT NULL
);

-- Serialize version changes with approval by locking their owning package first.
CREATE FUNCTION lock_binary_review_package() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE package_name text;
BEGIN
    package_name := CASE WHEN TG_OP = 'DELETE' THEN OLD.parent ELSE NEW.parent END;
    PERFORM 1 FROM packages
      WHERE parent = regexp_replace(package_name, '/packages/[0-9]+$', '')
        AND resource_id = substring(package_name FROM '/packages/([0-9]+)$')::integer
      FOR UPDATE;
    IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER binary_review_lock BEFORE INSERT OR DELETE ON binaries
    FOR EACH ROW EXECUTE FUNCTION lock_binary_review_package();

CREATE FUNCTION maintain_package_review_schedule() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE package_name text; package_parent text; package_id integer;
BEGIN
    package_name := CASE WHEN TG_OP = 'DELETE' THEN OLD.parent ELSE NEW.parent END;
    package_parent := regexp_replace(package_name, '/packages/[0-9]+$', '');
    package_id := substring(package_name FROM '/packages/([0-9]+)$')::integer;
    IF TG_OP = 'INSERT' THEN
        INSERT INTO package_review_schedule(parent, resource_id, approve_at)
          SELECT parent, resource_id, clock_timestamp() + interval '24 hours'
          FROM packages WHERE parent = package_parent AND resource_id = package_id
            AND (data->>'state')::integer = 2
          ON CONFLICT DO NOTHING;
    ELSIF NOT EXISTS (SELECT 1 FROM binaries WHERE parent = package_name) THEN
        DELETE FROM package_review_schedule WHERE parent = package_parent AND resource_id = package_id;
    END IF;
    RETURN NULL;
END;
$$;
CREATE TRIGGER binary_review_schedule AFTER INSERT OR DELETE ON binaries
    FOR EACH ROW EXECUTE FUNCTION maintain_package_review_schedule();

CREATE FUNCTION cancel_handled_package_review() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF (NEW.data->>'state')::integer IS DISTINCT FROM 2 THEN
        DELETE FROM package_review_schedule WHERE parent = NEW.parent AND resource_id = NEW.resource_id;
    END IF;
    RETURN NULL;
END;
$$;
CREATE TRIGGER package_review_cancel AFTER UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION cancel_handled_package_review();
