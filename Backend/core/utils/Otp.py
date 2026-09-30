import random
from rest_framework.exceptions import ValidationError


def generate_otp(length=6):
    """
    Generate a numeric OTP.
    """
    minimum = 10 ** (length - 1)
    maximum = (10 ** length) - 1
    return str(random.randint(minimum, maximum))


def validate_otp(otp_obj, entered_otp):
    """
    Validate OTP object and entered OTP.
    """

    if not otp_obj:
        raise ValidationError({
            "otp": "OTP not found."
        })

    if otp_obj.is_expired():
        raise ValidationError({
            "otp": "OTP has expired."
        })

    if otp_obj.otp != entered_otp:
        raise ValidationError({
            "otp": "Invalid OTP."
        })

    return True