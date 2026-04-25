"""
Small in-memory TTL cache for lightweight API response caching.
"""
from __future__ import annotations

from dataclasses import dataclass
from threading import Lock
from time import time
from typing import Generic, TypeVar

T = TypeVar("T")


@dataclass
class _CacheEntry(Generic[T]):
    value: T
    expires_at: float


class TTLCache(Generic[T]):
    def __init__(self, ttl_seconds: int = 60, max_items: int = 256):
        self.ttl_seconds = ttl_seconds
        self.max_items = max_items
        self._store: dict[str, _CacheEntry[T]] = {}
        self._lock = Lock()

    def _is_expired(self, entry: _CacheEntry[T]) -> bool:
        return entry.expires_at < time()

    def get(self, key: str) -> T | None:
        with self._lock:
            entry = self._store.get(key)
            if not entry:
                return None
            if self._is_expired(entry):
                self._store.pop(key, None)
                return None
            return entry.value

    def set(self, key: str, value: T) -> None:
        with self._lock:
            if len(self._store) >= self.max_items:
                # Drop one expired key first, otherwise the oldest inserted key.
                expired_key = next(
                    (k for k, v in self._store.items() if self._is_expired(v)),
                    None,
                )
                if expired_key:
                    self._store.pop(expired_key, None)
                else:
                    oldest_key = next(iter(self._store), None)
                    if oldest_key:
                        self._store.pop(oldest_key, None)

            self._store[key] = _CacheEntry(
                value=value,
                expires_at=time() + self.ttl_seconds,
            )
