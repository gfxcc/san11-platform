from handler.util.time_util import get_now

from ..base import ModelBase
from .tracklifecycle import Action, ModelActivity, search_activity


class Likeable:
    '''
    A sub-class must contains 
        * IntAttrib named as `like_count`
        * IntAttrib named as `dislike_count`
    '''
    like_count: int
    dislike_count: int

    def toggle_like(self, actor: str) -> None:
        '''
        Handle like event

        Remove previous activity if exist, otherwise create it and remove conflict activies.
        '''
        self._toggle_activity(actor, Action.LIKE)

    def toggle_dislike(self, actor: str) -> None:
        '''
        Handle dislike event

        Remove previous activity if exist, otherwise create it and remove conflict activies.
        '''
        self._toggle_activity(actor, Action.DISLIKE)

    def _toggle_activity(self, actor: str, action: Action) -> None:
        '''
        Toggle an activity on this object.
        '''
        VALID_ACTIONS = {Action.LIKE, Action.DISLIKE}
        assert action in VALID_ACTIONS, f'Invalid action: {action}'
        assert isinstance(
            self, ModelBase), 'Only a `ModelBase` can subclass `Likeable`'

        ACTION2FIELD = {
            Action.LIKE: 'like_count',
            Action.DISLIKE: 'dislike_count',
        }
        prev_act = search_activity(
            actor, action, self.name)
        if prev_act:
            prev_act.delete()
            setattr(self, ACTION2FIELD[action], getattr(
                self, ACTION2FIELD[action]) - 1)
        else:
            ModelActivity('', get_now(), action.value,
                          self.name).create(parent=actor)
            setattr(self, ACTION2FIELD[action], getattr(
                self, ACTION2FIELD[action]) + 1)

            reversed_action = Action.DISLIKE if action == Action.LIKE else Action.LIKE
            reversed_act = search_activity(actor, reversed_action, self.name)
            if reversed_act:
                reversed_act.delete()
                setattr(self, ACTION2FIELD[reversed_action], getattr(
                    self, ACTION2FIELD[reversed_action]) - 1)
