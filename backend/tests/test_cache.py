import time

from cache import TTLCache


def test_ttl_cache_returns_cached_value_before_expiry() -> None:
    cache: TTLCache[str] = TTLCache(ttl_seconds=10, max_items=2)
    cache.set('k1', 'v1')

    assert cache.get('k1') == 'v1'


def test_ttl_cache_expires_values() -> None:
    cache: TTLCache[str] = TTLCache(ttl_seconds=0, max_items=2)
    cache.set('k1', 'v1')
    time.sleep(0.01)

    assert cache.get('k1') is None


def test_ttl_cache_evicts_when_max_items_reached() -> None:
    cache: TTLCache[str] = TTLCache(ttl_seconds=10, max_items=2)
    cache.set('k1', 'v1')
    cache.set('k2', 'v2')
    cache.set('k3', 'v3')

    present_values = {cache.get('k1'), cache.get('k2'), cache.get('k3')}
    assert 'v3' in present_values
    assert len([v for v in present_values if v is not None]) == 2
