import os
import logging
from typing import Union

from ..protos import san11_platform_pb2
from ..model.package import Package
from ..model.binary import Binary
from ..model.url import Url
from ..model.user.user import User
from ..model.comment.comment import Comment
from ..model.comment.reply import Reply
from .session import Session
from ..model.exception import Unauthenticated, PermissionDenied


logger = logging.getLogger(os.path.basename(__file__))


class Authenticator:
    def __init__(self, session: Session) -> None:
        self.session = session

    @classmethod
    def from_context(cls, context):
        session = None
        sid = dict(context.invocation_metadata()).get('sid', None)
        logger.debug(f'sid={sid}.')
        if not sid:
            raise Unauthenticated('请登录')
        try:
            session = Session.from_sid(sid)
        except LookupError as err:
            raise Unauthenticated('请重新登录')
        except Exception as err:
            logger.error(f'Failed to load session: {err}')
            raise
        return cls(session)

    def isAdmin(self) -> bool:
        return self.session.user.isAdmin()
    
    # Package
    def canDeletePackage(self, package: Package) -> bool:
        if self.isAdmin() or self._super_admin():
            return True
        user = self.session.user
        return user.user_id == package.author_id
    
    def canUpdatePackage(self, package: Package) -> bool:
        if self._super_admin():
            return True
        user = self.session.user
        return user.user_id == package.author_id
    
    # Binary
    def canUploadBinary(self, parent: Url) -> bool:
        if self._super_admin():
            return True
        package = Package.from_id(parent.package_id)
        user = self.session.user
        return user.user_id == package.author_id
    
    def canDeleteBinary(self, binary: Binary) -> bool:
        if self.isAdmin() or self._super_admin():
            return True
        user = self.session.user
        package = Package.from_id(binary.package_id)
        return user.user_id == package.author_id

    def canUpdateBinary(self, binary: Binary) -> bool:
        if self.isAdmin() or self._super_admin():
            return True
        user = self.session.user
        package = Package.from_id(binary.package_id)
        return user.user_id == package.author_id
    # Image
    def canUploadImage(self, parent: Url) -> bool:
        if self._super_admin():
            return True
        user = self.session.user

        if parent.type == 'packages':
            package = Package.from_id(parent.id)
            return self.canUpdatePackage(package)
        elif parent.type == 'users':
            user = User.from_id(parent.id)
            return self.canUpdateUser(user)
        return False
    
    # Comment
    def canDeleteComment(self, comment: Comment) -> bool:
        if self.isAdmin() or self._super_admin():
            return True
        user = self.session.user
        return user.user_id == comment.author_id

    def canUpdateComment(self, current: Comment, requested: san11_platform_pb2.Comment) -> bool:
        if self._super_admin():
            return True
        user = self.session.user
        can = True
        if requested.text:
            can = can and (user.user_id == current.author_id)
        if requested.upvote_count:
            can = can and True
        return can

    def canDeleteReply(self, reply: Reply) -> bool:
        if self.isAdmin() or self._super_admin():
            return True
        user = self.session.user
        return user.user_id == reply.author_id

    # User
    def canUpdateUser(self, user: User) -> bool:
        if self._super_admin():
            return True
        return user.user_id == self.session.user.user_id

    # internals
    def _super_admin(self) -> bool:
        '''
        Returns:
            true: login as admin and admin is allowed to do anything
        '''
        return self.isAdmin() and True


    
