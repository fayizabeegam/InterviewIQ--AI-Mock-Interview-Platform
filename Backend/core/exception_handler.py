from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Global exception handler for the project.
    Formats all DRF exceptions into a consistent response structure.
    """

    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "success": False,
            "message": "Request failed.",
            "errors": response.data,
        }

    return response