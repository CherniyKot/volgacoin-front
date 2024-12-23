import { Cell, List } from "@telegram-apps/telegram-ui";
import { FC, useEffect, useRef, useState } from "react";
import { initData, useSignal } from "@telegram-apps/sdk-react";

import volgaImage from './volga.png';
import volgaSmallImage from './volga-small.png';
import energyImage from './energy.webp';
import { Base64 } from "js-base64";

interface FloatingNumber {
    id: number;
    x: number;
    y: number;
    value: string;
}
const radius = 50

const controllerURL = "/api/click"

const maxEnergy = 2500

export const ClickerSubpage: FC = () => {
    const [numbers, setNumbers] = useState<FloatingNumber[]>([]);
    const [newNumberId, setNewNumberId] = useState(0);

    const imageRef = useRef<HTMLImageElement | null>(null);


    const [energy, setEnergy] = useState(maxEnergy);
    const [clicks, setClicks] = useState(0);

    const clickPool = useRef(0);

    const initDataRaw = useSignal(initData.raw);
    const initDataSnapshot = Base64.encode(JSON.stringify(Object.fromEntries(new URLSearchParams(initDataRaw))))
    useEffect(() => {
        const sendData = () => {
            const collectedClicks = clickPool.current + 0
            clickPool.current -= collectedClicks
            const body = { "clicks": collectedClicks }
            console.log(JSON.stringify(body))
            return fetch(controllerURL,
                {
                    method: "POST",
                    headers: { "Authorization": "tma " + initDataSnapshot, "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                })
                .then(response => {
                    if (!response.ok) {
                        return Promise.reject(response);
                    }
                    return response.json();
                })
                .then(data => {
                    setClicks(data.clicks)
                    setEnergy(data.energy)
                })
        }

        const runSendData = () => sendData().finally(() => { setTimeout(runSendData, 2000) })
        runSendData()

        return () => { sendData(); }
    }, [])


    const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const rect = e.currentTarget.closest('.overlay')?.getBoundingClientRect();
        const x = e.clientX - (rect?.left ?? 0) + (Math.random() - 0.5) * radius;
        const y = e.clientY - (rect?.top ?? 0) + (Math.random() - 0.5) * radius;
        const newNumber: FloatingNumber = {
            id: newNumberId,
            x,
            y,
            value: '+1',
        };
        setNewNumberId(newNumberId + 1)
        setNumbers((prev) => [...prev, newNumber]);

        // Анимация увеличения/уменьшения
        if (imageRef.current) {
            imageRef.current.classList.add('clicked');
            setTimeout(() => {
                if (imageRef.current) imageRef.current.classList.remove('clicked');
            }, 100);
        }

        // Удаляем число через 1.5 секунды
        setTimeout(() => {
            setNumbers((prev) => prev.filter((num) => num.id !== newNumber.id));
        }, 1500);

        if (energy > 0) {
            setEnergy(energy - 1)
            setClicks(clicks + 1)
            clickPool.current += 1
        }
    };
    return <List className="outerContainer">
        <div className="container">
            <Cell className="overlay" onClick={handleClick} />
            <img ref={imageRef} src={volgaImage} className='center-image' />
            {numbers.map((num) => (
                <div
                    key={num.id}
                    className="floating-number"
                    style={{
                        zIndex: 5,
                        left: num.x,
                        top: num.y,
                    }}
                >
                    {num.value}
                </div>
            ))}
        </div>
        <div className="iconHolderHolder">
            <Cell before={<img src={energyImage} className="icon" />} className="iconHolder">
                {energy}/{maxEnergy}
            </Cell>
            <Cell before={<img src={volgaSmallImage} className="icon" />} className="iconHolder">
                {clicks}
            </Cell>
        </div>
    </List>
}