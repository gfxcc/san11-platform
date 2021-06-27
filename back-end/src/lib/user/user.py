from __future__ import annotations
import os, uuid
import re
import json
import logging
from datetime import datetime, timezone
from typing import List

from ..protos import san11_platform_pb2
from ..db import run_sql_with_param_and_fetch_all, run_sql_with_param_and_fetch_one, \
                     run_sql_with_param, get_db_fields_str
from ..time_util import get_now
from ..image import Image
from ..time_util import get_timezone
from ..exception import Unauthenticated, AlreadyExists
from ..resource import ResourceMixin, ResourceView
from ..activity import TrackLifecycle, Activity, Action


logger = logging.getLogger(os.path.basename(__file__))
VERIFICATION_CODES_TABLE = 'verification_codes'


class User(ResourceMixin, TrackLifecycle):
    DEFAULT_USER_TYPE = 'regular'
    DEFAULT_USER_AVATAR = 'users/default_avatar.jpg'

    def __init__(self, user_id: int, username: str, password: str, email: str, user_type: str,
                 image_url: str, website: str):
        self.user_id = user_id
        self.username = username
        # Avoid loading password to prevent this sensitive information be propagated
        # self.password = password 
        self.email = email
        self.user_type = user_type
        self.image_url = image_url
        self.website = website
    
    @property
    def url(self) -> str:
        '''
        [DEPRECATED]
        Please use `name`.
        '''
        return f'users/{self.user_id}'

    @property
    def name(self) -> str:
        return f'users/{self.user_id}'
    
    @property
    def id(self) -> int:
        return self.user_id
    
    @property
    def view(self) -> ResourceView:
        return ResourceView(
            name=self.name,
            display_name='用户',
            description=None,
            image_url=self.image_url
        )

    @classmethod
    def db_table(cls) -> str:
        return 'users'

    @classmethod
    def db_fields(cls) -> List[str]:
        return ['user_id', 'username', 'password', 'email', 'user_type', 'image_url', 'website']

    @classmethod
    def name_pattern(cls) -> str:
        return r'users/[0-9]+'

    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, email: str) -> None:
        self._email = email

    @property
    def website(self) -> str:
        return self._website
    
    @website.setter
    def website(self, website: str) -> None:
        self.validate_website(website)
        self._website = website

    def __str___(self):
        return f'{{ user_id: {self.user_id}, username: {self.username}, '\
               f'email: {self.email}, image_url: {self.image_url}, website: {self.website} }}'
    
    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.User) -> User:
        return cls(
            user_id=pb_obj.user_id,
            username=pb_obj.username,
            password='password_placeholder',
            email=pb_obj.email,
            user_type=pb_obj.user_type,
            image_url=pb_obj.image_url,
            website=pb_obj.website
        )

    def create(self, password: str):
        '''
        Override default implementation as `User` require special handling on `password`
        '''
        self.validate_password(password)
        sql = f'INSERT INTO {self.db_table()} '\
              ' VALUES ((SELECT MAX(user_id) FROM users)+1, %(username)s, %(password)s, '\
              '%(email)s, %(user_type)s, %(create_timestamp)s, %(image_url)s, %(website)s) RETURNING user_id'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'username': self.username,
            'password': password,
            'email': self.email,
            'user_type': self.DEFAULT_USER_TYPE,
            'create_timestamp': get_now(),
            'image_url': self.image_url ,
            'website': self.website
        }, transaction=True)
        self.user_id = resp[0]
        self.user_type = self.DEFAULT_USER_TYPE
        Activity(activity_id=None, user_id=self.user_id, create_time=get_now(),
                 action=Action.CREATE, resource_name=self.name).create()
    
    def delete(self):
        raise NotImplementedError()

    def to_pb(self) -> san11_platform_pb2.User:
        return san11_platform_pb2.User(user_id=self.user_id,
                                       username=self.username,
                                       email=self.email,
                                       user_type=self.user_type,
                                       image_url=self.image_url or self.DEFAULT_USER_AVATAR,
                                       website=self.website)

    def validate(self, password: str) -> None:
        '''
        Raise:
            Unauthenticated: ...
        '''
        sql = 'SELECT * FROM users WHERE username=%(username)s AND password=%(password)s'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'username': self.username,
            'password': password
        })
        if not resp:
            raise Unauthenticated()
    
    def isAdmin(self) -> bool:
        return self.user_type == 'admin'

    def set_image(self, image: Image):
        self.image_url = image.url
        sql = 'UPDATE users SET image_url=%(image_url)s WHERE user_id=%(user_id)s'
        param = {'image_url': self.image_url, 'user_id': self.user_id}
        run_sql_with_param(sql, param)
        logger.debug(f'sql={sql}, param={param}')
    
    def set_password(self, password: str) -> None:
        self.validate_password(password)
        sql = 'UPDATE users SET password=%(password)s WHERE user_id=%(user_id)s'
        run_sql_with_param(sql, {
            'password': password,
            'user_id': self.user_id
        })
    
    def update(self) -> None:
        # TODO: migrate default impl
        sql = 'UPDATE users SET '\
            'username=%(username)s, '\
            'email=%(email)s, '\
            'image_url=%(image_url)s, '\
            'website=%(website)s '\
            'WHERE user_id=%(user_id)s'
        run_sql_with_param(sql, {
            'username': self.username,
            'email': self.email,
            'image_url': self.image_url,
            'website': self.website,
            'user_id': self.user_id
        })

    @classmethod
    def from_name(cls, username: str):
        '''
        Raise:
            LookupError: ...
        '''
        sql = 'SELECT user_id, email, user_type, image_url, website FROM users WHERE username=%(username)s'
        try:
            resp = run_sql_with_param_and_fetch_all(
                sql, {'username': username})[0]
        except Exception:
            raise LookupError(f'user: {username} does not exist')

        return cls(resp[0], username, 'password_placeholder', resp[1], resp[2], resp[3], resp[4])
    
    @classmethod
    def from_email(cls, email: str):
        '''
        Raise:
            LookupError: ...
        '''
        sql = 'SELECT user_id, username, email, user_type, image_url, website FROM users WHERE email=%(email)s'
        try:
            resp = run_sql_with_param_and_fetch_all(
                sql, {'email': email})[0]
        except Exception:
            raise LookupError(f'email: {email} is not being used by any account')
        return cls(resp[0], resp[1], 'password_placeholder', resp[2], resp[3], resp[4], resp[5])
    
    @staticmethod
    def validate_email(email: str) -> None:
        '''
        Raise if
            ValueError: if Invalid format
            AlreadyExists: if email is already used by an accout
        '''
        ADMIN_EMAIL = 'ycao181@gmail.com'
        if re.fullmatch(r'[^@]+@[^@]+\.[^@]+', email) is None:
            raise ValueError('无效的邮箱地址')
        try:
            # Allow admin to reuse email for new account for testing.
            if email == ADMIN_EMAIL:
                return
            User.from_email(email)
        except LookupError:
            return  # OK, username is not being used
        else:
            raise AlreadyExists("邮箱已被使用")

    @staticmethod
    def validate_password(password: str) -> None:
        if re.fullmatch(r'[0-9a-zA-Z\-_]{4,32}', password) is None:
            raise ValueError("密码要求: [长度] 4-32 [字符] 英文字母大小写 数字 - _")
    
    @staticmethod
    def validate_username(username: str) -> None:
        '''
        Raise:
            ValueError: if username is illegal
            AlreadyExists: if username is already used in db
        '''
        # if re.fullmatch(r'[0-9a-zA-Z\-_]{4,32}', username) is None:
        if not (len(username) <= 32 and ' ' not in username):
            raise ValueError("用户名要求: [长度] 4-32 [字符] 不包含空格")

        try:
            User.from_name(username)
        except LookupError:
            return  # OK, username is not being used
        else:
            raise AlreadyExists("用户名已被使用")
    
    @staticmethod
    def validate_website(website: str) -> None:
        pass


def generate_verification_code(email: str) -> str:
    '''
    Generate a verification_code and persist it into DB.
    '''
    sql = f'DELETE FROM {VERIFICATION_CODES_TABLE} WHERE email=%(email)s'
    run_sql_with_param(sql, {
        'email': email
    })

    verification_code = str(uuid.uuid1())
    sql = f'INSERT INTO {VERIFICATION_CODES_TABLE} (email, code) VALUES (%(email)s, %(code)s)'
    run_sql_with_param(sql, {
        'email': email,
        'code': verification_code
    })
    return verification_code

def verify_code(email: str, code: str) -> bool:
    sql = f'SELECT * FROM {VERIFICATION_CODES_TABLE} WHERE email=%(email)s AND code=%(code)s'
    resp = run_sql_with_param_and_fetch_one(sql, {
        'email': email,
        'code': code
    })
    return resp != None
