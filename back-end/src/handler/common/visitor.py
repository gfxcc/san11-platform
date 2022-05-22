# Stores the actual visitor methods
_methods = {}


def _qualname(obj):
    '''Get the fully-qualified name of an object (including module).'''
    return obj.__module__ + '.' + obj.__qualname__


def _declaring_class(obj):
    '''Get the name of the class that declared an object.'''
    name = _qualname(obj)
    return name[:name.rfind('.')]


def _visitor_impl(self, arg):
    '''Actual visitor method implementation.'''
    method = _methods[(_qualname(type(self)), type(arg))]
    return method(self, arg)


def visitor(arg_type):
    '''Decorator that creates a visitor method.'''

    def decorator(fn):
        declaring_class = _declaring_class(fn)
        _methods[(declaring_class, arg_type)] = fn

        # Replace all decorated methods with _visitor_impl
        return _visitor_impl

    return decorator
