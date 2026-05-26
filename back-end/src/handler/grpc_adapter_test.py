import unittest
from unittest import mock

from handler.common.exception import InvalidArgument
from handler.grpc_adapter import grpc_abort_on_exception
from handler.handler_context import HandlerContext


class GrpcAbortOnExceptionTest(unittest.TestCase):
    def test_passes_handler_context_to_rpc(self):
        service_context = mock.Mock()
        handler_context = mock.Mock()
        request = mock.Mock()

        with mock.patch.object(
                HandlerContext, 'from_service_context',
                return_value=handler_context) as from_service_context:
            rpc = mock.Mock(return_value='ok')
            wrapped = grpc_abort_on_exception(rpc)

            ret = wrapped(mock.Mock(), request, service_context)

        self.assertEqual(ret, 'ok')
        from_service_context.assert_called_once_with(service_context)
        rpc.assert_called_once_with(mock.ANY, request, handler_context)

    def test_aborts_with_client_error_code(self):
        context = mock.Mock()
        context.invocation_metadata.return_value = []

        def rpc(this, request, handler_context):
            raise InvalidArgument('bad request')

        with mock.patch.object(HandlerContext, 'from_service_context',
                               return_value=mock.Mock()):
            grpc_abort_on_exception(rpc)(mock.Mock(), mock.Mock(), context)

        context.abort.assert_called_once_with(code=3, details='bad request')

    def test_aborts_unknown_errors_as_internal(self):
        context = mock.Mock()
        context.invocation_metadata.return_value = []

        def rpc(this, request, handler_context):
            raise RuntimeError('boom')

        with mock.patch.object(HandlerContext, 'from_service_context',
                               return_value=mock.Mock()):
            grpc_abort_on_exception(rpc)(mock.Mock(), mock.Mock(), context)

        context.abort.assert_called_once_with(code=255, details='Internal error')


if __name__ == '__main__':
    unittest.main()
