
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from coding.models import CodingQuestion
from coding.serializers import CodingQuestionSerializer
from admin_panel.permissions import IsSuperUser


# =================================================
# Admin - List All Coding Questions
# =================================================

class AdminQuestionsListAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):

        questions = (
            CodingQuestion.objects
            .select_related("skill")
            .prefetch_related("test_cases")
            .order_by("-created_at")
        )

        serializer = CodingQuestionSerializer(
            questions,
            many=True
        )

        data = serializer.data

        for index, question in enumerate(questions):
            data[index]["test_cases_count"] = question.test_cases.count()

        return Response({
            "success": True,
            "total": len(data),
            "data": data
        })


# =================================================
# Admin - Coding Question Detail
# =================================================

class AdminQuestionDetailAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get_object(self, pk):
        return get_object_or_404(
            CodingQuestion.objects
            .select_related("skill")
            .prefetch_related("test_cases"),
            pk=pk
        )

    def get(self, request, pk):

        question = self.get_object(pk)

        serializer = CodingQuestionSerializer(question)

        data = dict(serializer.data)

        data["test_cases"] = [
            {
                "id": str(test_case.id),
                "input_data": test_case.input_data,
                "expected_output": test_case.expected_output,
                "is_sample": test_case.is_sample,
                "order": test_case.order,
            }
            for test_case in question.test_cases.all()
        ]

        return Response({
            "success": True,
            "data": data
        })

    def delete(self, request, pk):

        question = self.get_object(pk)
        question.delete()

        return Response({
            "success": True,
            "message": "Coding question deleted successfully."
        }, status=status.HTTP_200_OK)
