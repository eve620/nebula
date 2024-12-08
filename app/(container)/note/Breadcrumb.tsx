import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
    dir: string | undefined
    id: string | undefined
    dirMenu: any[]
    menu: any[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({dir, id, dirMenu, menu}) => {
    return (
        <ol className="flex flex-wrap text-gray-500 dark:text-gray-300 items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
            {dir ?
                <>{id ?
                    <>
                        <li className={"hover:text-gray-900 dark:hover:text-gray-100"}>
                            <Link className={""} href={"note"}>Home</Link>
                        </li>
                        <li className={"cursor-default"}>{">"}</li>
                        <li className={"hover:text-gray-900 dark:hover:text-gray-100"}>
                            <Link className={""}
                                  href={`note?dir=${dir}`}>{dirMenu.find(item => item.id === Number(dir))?.name}</Link>
                        </li>
                        <li className={"cursor-default"}>{">"}</li>
                        <li className={""}>
                        <span
                            className={"cursor-default"}>{menu.find(item => item.id === Number(id))?.name}</span>
                        </li>
                    </> :
                    <>
                        <li className={"hover:text-gray-900 dark:hover:text-gray-100"}>
                            <Link className={""} href={"note"}>Home</Link>
                        </li>
                        <li className={"cursor-default"}>{">"}</li>
                        <li className={""}>
                        <span
                            className={"cursor-default"}>{dirMenu.find(item => item.id === Number(dir))?.name}</span>
                        </li>
                    </>}
                </> :
                <>
                    <li className={""}>
                        <span className={"cursor-default"}>Home</span>
                    </li>
                </>}
        </ol>
    )
}

export default Breadcrumb