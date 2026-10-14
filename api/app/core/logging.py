import sys
import logging
from loguru import logger

SENSITIVE_KEYS = {"password", "access_token", "token", "secret", "authorization"}

class InterceptHandler(logging.Handler):
    """
    Intercept standard logging messages and redirect them to Loguru.
    """
    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

def sanitize_data(data: dict) -> dict:
    """
    Sanitize sensitive information from log payloads.
    """
    if not isinstance(data, dict):
        return data
    sanitized = {}
    for key, value in data.items():
        if key.lower() in SENSITIVE_KEYS:
            sanitized[key] = "[REDACTED]"
        elif isinstance(value, dict):
            sanitized[key] = sanitize_data(value)
        else:
            sanitized[key] = value
    return sanitized

def setup_logging(log_level: str = "INFO") -> None:
    """
    Centralized logging configuration using Loguru.
    """
    logger.remove()
    
    # Custom format with color and structured layout
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    )

    logger.add(
        sys.stdout,
        enqueue=True,
        backtrace=True,
        level=log_level.upper(),
        format=log_format,
    )

    # Direct standard loggers (uvicorn, fastapi) to Loguru
    for log_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
        std_logger = logging.getLogger(log_name)
        std_logger.handlers = [InterceptHandler()]
        std_logger.propagate = False

    logger.info(f"Logging initialized with level: {log_level.upper()}")

__all__ = ["logger", "setup_logging", "sanitize_data"]
