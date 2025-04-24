import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay = 500): [T, Dispatch<SetStateAction<T>>] {

    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay])

    return [debounced, setDebounced];

}