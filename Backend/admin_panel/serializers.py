
from rest_framework import serializers
from coding.models import*


class AdminCodingTestCaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = CodingTestCase
        fields = [
            "id",
            "input_data",
            "expected_output",
            "is_sample",
            "order",
        ]
        read_only_fields = ["id"]

    def validate_input_data(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Test case input cannot be empty."
            )
        return value

    def validate_expected_output(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Expected output cannot be empty."
            )
        return value


class AdminCodingQuestionWriteSerializer(serializers.ModelSerializer):

    test_cases = AdminCodingTestCaseSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = CodingQuestion
        fields = [
            "id",
            "title",
            "skill",
            "difficulty",
            "programming_language",
            "problem_statement",
            "input_format",
            "output_format",
            "constraints",
            "sample_input",
            "sample_output",
            "explanation",
            "test_cases",
        ]
        read_only_fields = ["id"]

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Question title is required."
            )
        return value

    def validate_problem_statement(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Problem statement is required."
            )
        return value

    def validate(self, attrs):
        test_cases = attrs.get("test_cases")

        if self.instance is None and not test_cases:
            raise serializers.ValidationError({
                "test_cases": "Add at least one test case."
            })

        if test_cases is not None and not test_cases:
            raise serializers.ValidationError({
                "test_cases": "A question must have at least one test case."
            })

        return attrs

    def create(self, validated_data):
        test_cases_data = validated_data.pop("test_cases", [])

        question = CodingQuestion.objects.create(**validated_data)

        for index, case_data in enumerate(test_cases_data, start=1):
            CodingTestCase.objects.create(
                question=question,
                order=case_data.get("order", index),
                **{
                    key: value
                    for key, value in case_data.items()
                    if key != "order"
                }
            )

        return question

    def update(self, instance, validated_data):
        test_cases_data = validated_data.pop("test_cases", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # Replace test cases only when the request includes them.
        if test_cases_data is not None:
            instance.test_cases.all().delete()

            for index, case_data in enumerate(test_cases_data, start=1):
                CodingTestCase.objects.create(
                    question=instance,
                    order=case_data.get("order", index),
                    **{
                        key: value
                        for key, value in case_data.items()
                        if key != "order"
                    }
                )

        return instance
