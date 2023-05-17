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
    const URL = import.meta.env.VITE_API_URL;
    const shouldFetch = (localStorage.getItem("token") !== null) ? `${URL}/message` : null;

    const { data, mutate, isLoading, error, isValidating } = useSWR<MessageI[]>(shouldFetch, fetcher);

    return {
        messages: data,
        isLoading: isLoading || isValidating,
        messageError: error,
        messageMutate: mutate
    }
}