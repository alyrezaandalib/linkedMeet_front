import {Button, Input, Modal, ModalBody, ModalContent, ModalHeader} from "@heroui/react";
// icons
import {IoMdCheckmark} from "react-icons/io";
import {IoIosClose} from "react-icons/io";
import {useEffect} from "react";

interface SelectableModalProps {
    title: string;
    handleSearch: (searchValue: string) => void;
    items: string[];
    selectedItem: any;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: string | null) => void;
}

export default function SelectableModal({
                                            title,
                                            handleSearch,
                                            items,
                                            selectedItem,
                                            isOpen,
                                            onClose,
                                            onSelect
                                        }: SelectableModalProps) {
    // useEffect(() => {
    //     if (isOpen) {
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "auto";
    //     }
    // }, [isOpen]);

    return (
        <Modal size="full" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent className="fixed inset-0 bg-white">
            {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                        <div
                            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3"></div>
                        <ModalBody className={"overflow-auto pb-20"}>

                            {/* search ...*/}
                            <Input
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={"Search..."}
                                variant={"bordered"}
                                className={"my-2"}
                            />

                            {
                                selectedItem?.name && <>
                                    <div
                                        className={"font-semibold text-sm flex justify-between items-center px-6"}>{selectedItem?.name}
                                        <button className={"!p-0"} onClick={() => {
                                            onSelect(null)
                                        }}>
                                            <IoIosClose className={"text-2xl"}/>
                                        </button>
                                    </div>
                                    <div
                                        className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                </>
                            }
                            <div className="flex flex-col">
                                {items?.map((item: any, index) => (
                                    <div key={index}>
                                        <Button
                                            onPress={() => {
                                                onSelect(item);
                                                onCloseModal();
                                            }}
                                            variant="light"
                                            size="lg"
                                            radius="sm"
                                            className={"flex justify-between py-6 w-full text-sm"}
                                        >
                                            {item.name}
                                            {selectedItem === item && (
                                                <IoMdCheckmark className="text-blue-500 text-xl"/>
                                            )}
                                        </Button>
                                        <div
                                            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>
                                ))}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
