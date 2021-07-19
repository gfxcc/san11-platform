# import unittest
# from unittest.mock import Mock

# from .context import setup_context
# from ...src.handler.protos import san11_platform_pb2 as pb
# from ...src.handler.protos.san11_platform_pb2 import SignUpRequest, SendVerificationCodeRequest
# from ...src.handler import UserHandler
# from ...src.handler.model.user import generate_verification_code


# TEST_USERNAME = 'a-simple-username'
# TEST_PASSWORD = 'a-simple-password'
# TEST_EMAIL = 'a-simple-email@san11pk.org'


# class TestUserHandler(unittest.TestCase):
#     def setUp(self) -> None:
#         self.handler = UserHandler()
#         self.mock_context = setup_context()
#         return super().setUp()

#     def test_sign_up(self):
#         # GIVEN
#         request = SignUpRequest(
#             user=pb.User(
#                 username=TEST_USERNAME,
#                 email=TEST_EMAIL,
#             ),
#             password=TEST_PASSWORD,
#             verification_code=generate_verification_code(TEST_EMAIL)
#         )

#         # WHEN
#         resp : pb.SignUpResponse= self.handler.sign_up(request=request, context=self.mock_context)

#         # THEN
#         self.assertTrue(isinstance(resp, pb.SignUpResponse))
#         self.assertEqual(resp.user.username, TEST_USERNAME)
