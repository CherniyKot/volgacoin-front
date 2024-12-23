import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Cell, List } from "@telegram-apps/telegram-ui";
import { FC, useEffect, useState } from "react";

const controllerURL = "/api/rating"

interface RatingEntry {
    login: string;
    clicks: number;
}

export const RatingSubpage: FC = () => {
    const [ratingEntries, setRatingEntries] = useState<RatingEntry[]>([{login:"Test",clicks:0}])


    const initDataRaw = useSignal(initData.raw);
    let initDataSnapshot = Object.fromEntries(new URLSearchParams(initDataRaw))
    initDataSnapshot.user = JSON.parse(initDataSnapshot.user)
    useEffect(() => {
        const getData = () => fetch(controllerURL,
            {
                method: "GET",
                headers: { "Authorization": "tma " + JSON.stringify(initDataSnapshot) }
            })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then((data: RatingEntry[]) => {
                data.sort((a, b) => a.clicks - b.clicks)
                setRatingEntries(data)
            })
        getData()

        setInterval(getData, 5000)
    }, [])


    return <List className="outerContainer">
        {ratingEntries.map((e, i) => (<Cell before={<Cell>#{i+1}</Cell>} after={<Cell>{e.clicks}</Cell>}>{e.login}</Cell>))}
    </List>
}