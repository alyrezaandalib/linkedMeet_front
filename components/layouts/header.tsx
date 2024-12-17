import DrawerMenu from "@/components/layouts/drawer-menu";

export default function Header(){
    return (
        <div className={"flex justify-between items-center px-5 py-3"}>
            <DrawerMenu/>

        </div>
    )
}