class ContentRouter:
    """App `content` vive no MongoDB; auth/sessões/admin ficam no SQLite (default)."""

    app_label = "content"

    def db_for_read(self, model, **hints):
        return "content" if model._meta.app_label == self.app_label else None

    db_for_write = db_for_read

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == self.app_label:
            return db == "content"
        return db == "default"
