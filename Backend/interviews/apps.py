from django.apps import AppConfig


class InterviewsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "interviews"

    def ready(self):
        from interviews.views import get_piper_voice

        try:
            get_piper_voice()
            print("Piper Amy voice loaded successfully.")
        except Exception as error:
            print(f"Piper voice preload failed: {error}")