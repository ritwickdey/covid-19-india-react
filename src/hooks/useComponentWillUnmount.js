import { useEffect } from 'react';
export function useComponentWillUnmount(fn) {
    useEffect(() => () => {
        fn();
    }, []);
}
