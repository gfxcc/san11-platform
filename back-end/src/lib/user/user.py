from __future__ import annotations
import os
import re
import json
import logging
from datetime import datetime, timezone

from ..protos import san11_platform_pb2
from ..db_util import run_sql_with_param_and_fetch_all, run_sql_with_param_and_fetch_one, \
                     run_sql_with_param
from ..image import Image
from ..time_util import get_timezone


logger = logging.getLogger(os.path.basename(__file__))
DEFAULT_USER_AVATAR = 'users/default_avatar.jpg'


class InvalidPassword(Exception):
    pass


class User:
    def __init__(self, user_id: int, username: str, email: str, user_type: str,
                 image_url: str, website: str):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.user_type = user_type
        self.image_url = image_url
        self.website = website
    
    @property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, email: str) -> None:
        self.validate_email(email)
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

    def validate(self, password: str) -> None:
        '''
        Raise:
            InvalidPassword: ...
        '''
        sql = 'SELECT * FROM users WHERE username=%(username)s AND password=%(password)s'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'username': self.username,
            'password': password
        })
        if not resp:
            raise InvalidPassword()
    
    def isAdmin(self) -> bool:
        return self.user_type == 'admin'

    def to_pb(self) -> san11_platform_pb2.User:
        return san11_platform_pb2.User(user_id=self.user_id,
                                       username=self.username,
                                       email=self.email,
                                       user_type=self.user_type,
                                       image_url=self.image_url or DEFAULT_USER_AVATAR,
                                       website=self.website)
    
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
        sql = 'UPDATE users SET '\
            'email=%(email)s, '\
            'image_url=%(image_url)s, '\
            'website=%(website)s '\
            'WHERE user_id=%(user_id)s'
        run_sql_with_param(sql, {
            'email': self.email,
            'image_url': self.image_url,
            'website': self.website,
            'user_id': self.user_id
        })

    @classmethod
    def create(cls, user: san11_platform_pb2.User, password: str):
        cls.validate_email(user.email)
        cls.validate_password(password)
        cls.validate_username(user.username)

        sql = 'INSERT INTO users (user_id, username, password, email, user_type, create_timestamp, image_url, website)'\
              ' VALUES ((SELECT MAX(user_id) FROM users)+1, %(username)s, %(password)s, '\
              '%(email)s, %(user_type)s, %(create_timestamp)s, %(image_url)s, %(website)s) RETURNING user_id'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'username': user.username,
            'password': password,
            'email': user.email,
            'user_type': 'regular',
            'create_timestamp': datetime.now(get_timezone()),
            'image_url': user.image_url ,
            'website': user.website
        })

        return cls(resp[0], user.username, user.email, user.user_type, user.image_url, user.website)

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
            logger.info(f'user: {username} does not exist. ')
            raise LookupError(f'user: {username} does not exist')

        return cls(resp[0], username, resp[1], resp[2], resp[3], resp[4])
    
    @classmethod
    def from_user_id(cls, user_id: int) -> User:
        '''
        Raise:
            LookupError: ...
        '''
        sql = 'SELECT username, email, user_type, image_url, website FROM users WHERE user_id=%(user_id)s'
        try:
            resp = run_sql_with_param_and_fetch_one(
                sql, {'user_id': user_id})
        except Exception as err:
            logger.debug(err)
            logger.info(f'user_id: {user_id} does not exist. ')
            raise LookupError(f'user_id: {user_id} does not exist')

        return cls(user_id, resp[0], resp[1], resp[2], resp[3], resp[4])

    @staticmethod
    def validate_email(email: str) -> None:
        if re.fullmatch(r'[^@]+@[^@]+\.[^@]+', email) is None:
            raise ValueError('无效的邮箱地址')

    @staticmethod
    def validate_password(password: str) -> None:
        if re.fullmatch(r'[0-9a-zA-Z\-_]{4,32}', password) is None:
            raise ValueError("密码要求: [长度] 4-32 [字符] 英文字母大小写 数字 - _")
    
    @staticmethod
    def validate_username(username: str) -> None:
        '''
        Raise if
            1. username is illegal
            2. username is already used in db
        '''
        # if re.fullmatch(r'[0-9a-zA-Z\-_]{4,32}', username) is None:
        if not (len(username) <= 32 and ' ' not in username):
            raise ValueError("用户名要求: [长度] 4-32 [字符] 不包含空格")

        try:
            User.from_name(username)
        except LookupError:
            return  # OK, username is not being used
        else:
            raise ValueError("用户名已被使用")
    
    @staticmethod
    def validate_website(website: str) -> None:
        pass