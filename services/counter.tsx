import {useState, useEffect} from "react";

export default function Counter({delayResend = "120", setResendSMS}: any) {
    const [delay, setDelay] = useState(+delayResend);

    const formatTime = (time: number) => {
        return time < 10 ? `0${time}` : `${time}`;
    };

    const minutes = Math.floor(delay / 60);
    const seconds = delay % 60;

    useEffect(() => {
        setResendSMS(delay);

        if (delay <= 0) return; // Stop the timer when delay reaches 0

        const timer = setInterval(() => {
            setDelay((prevDelay) => prevDelay - 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [delay, setResendSMS]);

    return (
        <>
            <span>{formatTime(minutes)}:{formatTime(seconds)}</span>
        </>
    );
}