import {useEffect, useRef, useState} from "react";

function Chat(){
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const ws= useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8080/ws/chat");

        ws.current.onmessage = (event: MessageEvent) => {
            setMessages((messages) => [...messages, event.data]);
        }

        return () => {
            ws.current?.close();
        }
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setInput(e.currentTarget.value);
    }

    function handleSubmit() {
        if(input.trim() === "" || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(input);
        setMessages((messages) => [...messages, input]);
        setInput("");
    }

    return (
        <div>
            <h1>WebSocket Chat</h1>
            <ul>
                {messages.map((message: string, index: number) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <input placeholder="Enter message..." type="text" onChange={handleChange} value={input}/>
            <button onClick={handleSubmit}>Send</button>
        </div>
    )
}

export default Chat;
