from datetime import datetime

class Comment:
    def __init__(self, package_id: int, comment_id: int, create_time: datetime,
                 update_time: datetime, text: str, author_id: int, 
                 upvote_count: int) -> None:
        self.package_id = package_id
        self.comment_id = comment_id
        self.create_time = create_time
        self.update_time = update_time
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count
    
    def __str__(self) -> str:
        return f'{{comment_id: {self.comment_id}, text: {self.text}, author_id: {self.author_id} }}'
    
