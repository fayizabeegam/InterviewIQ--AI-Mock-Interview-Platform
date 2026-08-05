import random


def generate_otp(length=6):
    """
    Generate a numeric OTP.
    """
    minimum = 10 ** (length - 1)
    maximum = (10 ** length) - 1
    return str(random.randint(minimum, maximum))