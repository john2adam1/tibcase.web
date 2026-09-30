import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async loader whenever `deps` change and exposes derived
 * { data, error, loading, reload } state. `loading` is derived (not set in an effect),
 * so there are no cascading renders and stale responses are ignored.
 */
export function useAsync(loader, deps = []) {
  const loaderRef = useRef(loader);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const [nonce, setNonce] = useState(0);
  const key = `${JSON.stringify(deps)}#${nonce}`;

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => loaderRef.current())
      .then((data) => { if (active) setResult({ key, data, error: null }); })
      .catch((error) => { if (active) setResult({ key, data: null, error }); });
    return () => { active = false; };
  }, [key]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const settled = result.key === key;

  return {
    data: settled ? result.data : (result.data ?? null),
    error: settled ? result.error : null,
    loading: !settled,
    reload,
  };
}
