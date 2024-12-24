import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Cell, List } from "@telegram-apps/telegram-ui";
import { Base64 } from "js-base64";
import { FC, useEffect, useState } from "react";

const controllerURL = "/api/rating"

interface RatingEntry {
    username: string;
    clicks: number;
}

export const RatingSubpage: FC = () => {
    const [ratingEntries, setRatingEntries] = useState<RatingEntry[]>([])

    const initDataRaw = useSignal(initData.raw);
    const initDataSnapshot = Base64.encode(JSON.stringify(Object.fromEntries(new URLSearchParams(initDataRaw))))
    useEffect(() => {
        const getData = () => fetch(controllerURL,
            {
                method: "GET",
                headers: { "Authorization": "tma " + initDataSnapshot }
            })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then((data: RatingEntry[]) => {
                data.sort((a, b) => b.clicks - a.clicks)
                setRatingEntries(data)
            })

        const runGetData = () => getData().finally(() => { setTimeout(runGetData, 5000); })
        runGetData()
    }, [])


    return <List className="outerContainer">
        {ratingEntries.map((e, i) => (<Cell before={<Cell>#{i + 1}</Cell>} /*after={<Cell>{e.clicks}</Cell>}*/>{e.username}</Cell>))}
    </List>
}
