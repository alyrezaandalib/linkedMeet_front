"use client";
import {useRef} from "react";
import {Button} from "@heroui/button";
import {CiEdit} from "react-icons/ci";


export default function ImgUploader({setImage, isLoading}: any) {
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
        <Button isIconOnly radius={"full"} variant={"faded"} onPress={handleImageClick} isLoading={isLoading}>
            <CiEdit/>
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={handleImageChange}
            />
        </Button>
    );
}
