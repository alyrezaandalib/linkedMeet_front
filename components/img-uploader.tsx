"use client";
import { useRef } from "react";
import { Button } from "@nextui-org/button";

export default function ImgUploader({setImage} : any) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        inputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <Button onPress={handleImageClick}>
            Upload new picture
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={handleImageChange}
            />
        </Button>
    );
}
