
class Tag:
    def __init__(self, tag_id: int, name: str, category_id: int, mutable: bool):
        self.tag_id = tag_id
        self.name = name
        self.category_id = category_id
        self.mutable = mutable