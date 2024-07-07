import logging

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from core.utils.camel_case import convert_key_to_snake_case


class CustomPageNumberPagination(PageNumberPagination):

    def __init__(self, page_size=10):
        self.page_size = page_size

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'page_size': self.page_size,  # Добавляем page_size в ответ
            'results': data
        })

    @staticmethod
    def custom_sorting_pagination(queryset, filterset, request, default_sort, ordering_fields):
        if filterset.is_valid():
            queryset = filterset.qs

        sort = request.query_params.get('sort', default_sort)
        reverse_sort = sort.startswith('-')

        sort = convert_key_to_snake_case(sort.lstrip('-'))

        if sort not in ordering_fields:
            sort = default_sort

        if reverse_sort:
            sort = '-' + sort

        logging.debug(sort)

        queryset = queryset.order_by(sort)

        page_size = request.query_params.get('page_size', 5)
        paginator = CustomPageNumberPagination(page_size)
        result_page = paginator.paginate_queryset(queryset, request)

        return paginator, result_page
