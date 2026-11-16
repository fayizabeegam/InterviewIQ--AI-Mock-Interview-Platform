from django.db import transaction

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from coding.models import*
from coding.serializers import*
from admin_panel.serializers import*
from admin_panel.permissions import IsSuperUser



# =================================================
# Admin - Create Coding Question
# =================================================

class AdminQuestionCreateAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def post(self, request):

        serializer = AdminCodingQuestionWriteSerializer(
            data=request.data
        )

        if serializer.is_valid():
            with transaction.atomic():
                question = serializer.save()

            response_serializer = CodingQuestionSerializer(question)

            return Response({
                "success": True,
                "message": "Coding question created successfully.",
                "data": response_serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


# =================================================
# Admin - Update Coding Question
# =================================================

class AdminQuestionUpdateAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def put(self, request, pk):

        try:
            question = CodingQuestion.objects.get(pk=pk)
        except CodingQuestion.DoesNotExist:
            return Response({
                "success": False,
                "message": "Coding question not found.",
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminCodingQuestionWriteSerializer(
            question,
            data=request.data
        )

        if serializer.is_valid():
            with transaction.atomic():
                question = serializer.save()

            response_serializer = CodingQuestionSerializer(question)

            return Response({
                "success": True,
                "message": "Coding question updated successfully.",
                "data": response_serializer.data,
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):

        try:
            question = CodingQuestion.objects.get(pk=pk)
        except CodingQuestion.DoesNotExist:
            return Response({
                "success": False,
                "message": "Coding question not found.",
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminCodingQuestionWriteSerializer(
            question,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            with transaction.atomic():
                question = serializer.save()

            response_serializer = CodingQuestionSerializer(question)

            return Response({
                "success": True,
                "message": "Coding question updated successfully.",
                "data": response_serializer.data,
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)
