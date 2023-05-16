import useSWR from 'swr'
import { MessageI } from './useMessenger';

const fetcher = (url: string) =>
    fetch(url, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
    .then(res => res.json())

export default function useMessage() {
    const shouldFetch = (localStorage.getItem("token") !== null) ? "http://localhost:8001/message" : null;

    const { data, mutate, isLoading, error, isValidating } = useSWR<MessageI[]>(shouldFetch, fetcher);

    return {
        messages: data,
        isLoading: isLoading || isValidating,
        messageError: error,
        messageMutate: mutate
    }
}