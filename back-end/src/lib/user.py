from __future__ import annotations
import os
import re
import json
import logging
from datetime import datetime, timezone

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_all, run_sql_with_param_and_fetch_one, \
                     run_sql_with_param
from .image import Image
from .time_util import get_timezone


logger = logging.getLogger(os.path.basename(__file__))


class InvalidPassword(Exception):
    pass


class User:
    def __init__(self, user_id: int, username: str, email: str, user_type: str,
                 image_url: str):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.user_type = user_type
        self.image_url = image_url

    def __str___(self):
        return f'{{ user_id: {self.user_id}, username: {self.username}, '\
               f'email: {self.email}, image_url: {self.image_url} }}'

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

    def to_pb(self) -> san11_platform_pb2.User:
        return san11_platform_pb2.User(user_id=self.user_id,
                                       username=self.username,
                                       email=self.email,
                                       user_type=self.user_type,
                                       image_url=self.image_url)
    
    def set_image(self, image: Image):
        self.iamge_url = image.image_url
        sql = 'UPDATE users SET image_url=%(image_url)s WHERE user_id=%(user_id)s'
        run_sql_with_param(sql, {'image_url': self.image_url, 'user_id': self.user_id})

    @classmethod
    def create(cls, user: san11_platform_pb2.User, password: str):

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

        def validate_email(email: str) -> None:
            if re.fullmatch(r'[^@]+@[^@]+\.[^@]+', email) is None:
                raise ValueError('无效的邮箱地址')

        def validate_password(password: str) -> None:
            if re.fullmatch(r'[0-9a-zA-Z\-_]{4,32}', password) is None:
                raise ValueError("密码要求: [长度] 4-32 [字符] 英文字母大小写 - _")

        validate_email(user.email)
        validate_password(password)
        validate_username(user.username)

        sql = 'INSERT INTO users VALUES (DEFAULT, %(username)s, %(password)s, '\
              '%(email)s, %(user_type)s, %(create_timestamp)s, %(image_url)s) RETURNING user_id'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'username': user.username,
            'password': password,
            'email': user.email,
            'user_type': 'regular',
            'create_timestamp': datetime.now(get_timezone()),
            'image_url': user.image_url 
        })

        return cls(resp[0], user.username, user.email, user.user_type, user.image_url)

    @classmethod
    def from_name(cls, username: str):
        '''
        Raise:
            LookupError: ...
        '''
        sql = 'SELECT user_id, email, user_type, image_url FROM users WHERE username=%(username)s'
        try:
            resp = run_sql_with_param_and_fetch_all(
                sql, {'username': username})[0]
        except Exception:
            logger.info(f'user: {username} does not exist. ')
            raise LookupError(f'user: {username} does not exist')

        return cls(resp[0], username, resp[1], resp[2], resp[3])
    
    @classmethod
    def from_user_id(cls, user_id: int) -> User:
        '''
        Raise:
            LookupError: ...
        '''
        sql = 'SELECT username, email, user_type, image_url FROM users WHERE user_id=%(user_id)s'
        try:
            resp = run_sql_with_param_and_fetch_one(
                sql, {'user_id': user_id})
        except Exception as err:
            logger.debug(err)
            logger.info(f'user_id: {user_id} does not exist. ')
            raise LookupError(f'user_id: {user_id} does not exist')

        return cls(user_id, resp[0], resp[1], resp[2], resp[3])
