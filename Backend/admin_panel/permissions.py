
from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    Allow access only to authenticated Django superusers.
    """

    message = "Only administrators can access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser
        )
