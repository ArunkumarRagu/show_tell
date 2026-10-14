from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel, Field

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None

class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_prev: bool

class PaginatedData(BaseModel, Generic[T]):
    items: List[T]
    meta: PaginationMeta

class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: PaginatedData[T]

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str
    details: Optional[Any] = None

def create_paginated_response(
    items: List[T],
    total_items: int,
    page: int,
    page_size: int,
    message: str = "Operation successful"
) -> PaginatedResponse[T]:
    effective_size = max(1, page_size)
    total_pages = (total_items + effective_size - 1) // effective_size if total_items > 0 else 1
    meta = PaginationMeta(
        page=page,
        page_size=effective_size,
        total_items=total_items,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1
    )
    return PaginatedResponse(
        success=True,
        message=message,
        data=PaginatedData(items=items, meta=meta)
    )
