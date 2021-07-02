import sys, os
import logging


from .lib.protos import san11_platform_pb2
from .lib.url import Url
from .lib.auths import Authenticator
from .lib.package import Package
from .lib.binary import Binary
from .lib.statistic import Statistic
from .lib.sire_plugin import SirePlugin, SIRE_VERSION_TO_SUFFIX


logger = logging.getLogger(os.path.basename(__file__))

class AuthHandler:
    def get_auth(self, request, context):
        logger.info(f'In get_auth: action={request.action}')
        authenticate = Authenticator.from_context(context)
        # TODO: verify the user is a package author