import {Button, Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {IoMdCheckmark} from "react-icons/io";

interface SelectableModalProps {
    title: string;
    items: string[];
    selectedItem: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: string) => void;
}

export default function SelectableModal({title, items, selectedItem, isOpen, onClose, onSelect}: SelectableModalProps) {
    return (
        <Modal size="full" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                        <div
                            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3"></div>
                        <ModalBody>
                            <div className="flex flex-col">
                                {items?.map((item : any, index) => (
                                    <div key={index}>
                                        <Button
                                            onPress={() => {
                                                onSelect(item);
                                                onCloseModal();
                                            }}
                                            variant="light"
                                            size="lg"
                                            radius="sm"
                                            className={"flex justify-between py-6 w-full"}
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