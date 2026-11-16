
import json
from uuid import UUID

from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from coding.models import CodingQuestion, CodingTestCase
from coding.serializers import CodingQuestionSerializer
from resumes.models import Skill
from admin_panel.permissions import IsSuperUser


# =================================================
# Admin - Questions Bulk Upload
# =================================================

class AdminBulkUploadAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, difficulty):

        difficulty = difficulty.upper()

        if difficulty not in ["EASY", "MEDIUM", "HARD"]:
            return Response(
                {"message": "Invalid difficulty level."},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response(
                {"message": "Please select a JSON file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if uploaded_file.size > 5 * 1024 * 1024:
            return Response(
                {"message": "File size must not exceed 5 MB."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            content = uploaded_file.read().decode("utf-8-sig")
            data = json.loads(content)

        except (UnicodeDecodeError, json.JSONDecodeError):
            return Response(
                {"message": "Invalid JSON file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        questions = data.get("questions") if isinstance(data, dict) else data

        if not isinstance(questions, list) or not questions:
            return Response(
                {"message": "JSON must contain a non-empty questions list."},
                status=status.HTTP_400_BAD_REQUEST
            )

        validated_data = []
        errors = []

        for index, item in enumerate(questions):

            question_number = index + 1

            if not isinstance(item, dict):
                errors.append({
                    "question": question_number,
                    "error": "Question must be a JSON object."
                })
                continue

            question_data = item.copy()
            test_cases = question_data.pop("test_cases", [])

            # Validate selected difficulty
            if str(question_data.get("difficulty", "")).upper() != difficulty:
                errors.append({
                    "question": question_number,
                    "error": f"Question difficulty must be {difficulty}."
                })
                continue

            # -------------------------------------------------
            # Automatically resolve skill name or UUID
            # -------------------------------------------------

            skill_value = question_data.get("skill")

            if skill_value is None or str(skill_value).strip() == "":
                question_data["skill"] = None

            else:
                skill_value = str(skill_value).strip()

                # First search by skill name (Arrays, Strings, etc.)
                skill = Skill.objects.filter(
                    name__iexact=skill_value
                ).first()

                if skill:
                    question_data["skill"] = skill.pk

                else:
                    # If not found by name, check whether it is a UUID
                    try:
                        skill_uuid = UUID(skill_value)

                        skill = Skill.objects.filter(
                            pk=skill_uuid
                        ).first()

                        if skill:
                            question_data["skill"] = skill.pk

                        else:
                            errors.append({
                                "question": question_number,
                                "errors": {
                                    "skill": [
                                        f"Skill '{skill_value}' does not exist."
                                    ]
                                }
                            })
                            continue

                    except ValueError:
                        errors.append({
                            "question": question_number,
                            "errors": {
                                "skill": [
                                    f"Skill '{skill_value}' does not exist."
                                ]
                            }
                        })
                        continue

            # -------------------------------------------------
            # Validate question
            # -------------------------------------------------

            serializer = CodingQuestionSerializer(data=question_data)

            if not serializer.is_valid():
                errors.append({
                    "question": question_number,
                    "errors": serializer.errors
                })
                continue

            # -------------------------------------------------
            # Validate test cases
            # -------------------------------------------------

            if not isinstance(test_cases, list) or not test_cases:
                errors.append({
                    "question": question_number,
                    "error": "At least one test case is required."
                })
                continue

            test_case_errors = []

            for case_index, case in enumerate(test_cases):

                test_case_number = case_index + 1

                if not isinstance(case, dict):
                    test_case_errors.append({
                        "test_case": test_case_number,
                        "error": "Test case must be a JSON object."
                    })
                    continue

                if (
                    "input_data" not in case
                    or "expected_output" not in case
                ):
                    test_case_errors.append({
                        "test_case": test_case_number,
                        "error": "input_data and expected_output are required."
                    })
                    continue

                if (
                    not isinstance(case["input_data"], str)
                    or not isinstance(case["expected_output"], str)
                ):
                    test_case_errors.append({
                        "test_case": test_case_number,
                        "error": "Input and expected output must be strings."
                    })
                    continue

                if (
                    "is_sample" in case
                    and not isinstance(case["is_sample"], bool)
                ):
                    test_case_errors.append({
                        "test_case": test_case_number,
                        "error": "is_sample must be true or false."
                    })

                order = case.get("order", test_case_number)

                if (
                    not isinstance(order, int)
                    or isinstance(order, bool)
                    or order < 1
                ):
                    test_case_errors.append({
                        "test_case": test_case_number,
                        "error": "order must be a positive integer."
                    })

            if test_case_errors:
                errors.append({
                    "question": question_number,
                    "test_case_errors": test_case_errors
                })
                continue

            validated_data.append({
                "question": serializer.validated_data,
                "test_cases": test_cases
            })

        # -------------------------------------------------
        # Stop if any validation errors exist
        # -------------------------------------------------

        if errors:
            return Response(
                {
                    "message": "Upload failed. No questions were saved.",
                    "errors": errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Save questions and test cases atomically
        # -------------------------------------------------

        total_test_cases = 0

        with transaction.atomic():

            for item in validated_data:

                question = CodingQuestion.objects.create(
                    **item["question"]
                )

                for case_index, case in enumerate(item["test_cases"]):

                    CodingTestCase.objects.create(
                        question=question,
                        input_data=case["input_data"],
                        expected_output=case["expected_output"],
                        is_sample=case.get("is_sample", False),
                        order=case.get("order", case_index + 1)
                    )

                    total_test_cases += 1

        return Response(
            {
                "success": True,
                "message": f"{difficulty.title()} questions uploaded successfully.",
                "difficulty": difficulty,
                "total_questions_uploaded": len(validated_data),
                "total_test_cases_uploaded": total_test_cases
            },
            status=status.HTTP_201_CREATED
        )


# =================================================
# Admin - Coding Question Statistics
# =================================================

class AdminCodingQuestionStatsAPIView(APIView):

    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):

        total_questions = CodingQuestion.objects.count()

        easy_questions = CodingQuestion.objects.filter(
            difficulty__iexact="EASY"
        ).count()

        medium_questions = CodingQuestion.objects.filter(
            difficulty__iexact="MEDIUM"
        ).count()

        hard_questions = CodingQuestion.objects.filter(
            difficulty__iexact="HARD"
        ).count()

        return Response({
            "success": True,
            "data": {
                "total_questions": total_questions,
                "easy_questions": easy_questions,
                "medium_questions": medium_questions,
                "hard_questions": hard_questions,
            }
        })