"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import LoginModal from "./LoginModal";
import { signOut, useSession } from "next-auth/react";
import { isDataEmptyorUndefined } from "@/app/lib/utils";
import Logo from "./Logo";
import { useLoading } from "@/context/LoadingContext";
import { TriangleDownIcon, ExitIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserData } from "@/context/UserDataContext";
import { BookmarkIcon, UserCircleIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useLoginModal } from "@/context/LoginModalContext";
import SearchBox from "./SearchBox";

const Header = ({ rowdies }: { rowdies: any }) => {
    const { setLoading } = useLoading();
    const { userData } = useUserData();
    const { openLoginModal, setOpenLoginModal } = useLoginModal();
    const { data: session, status } = useSession();
    const router = useRouter();
    const dropdownRef = useRef<HTMLButtonElement | null>(null);

    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

    useEffect(() => {
        const body = document.querySelector("body");
        if (openLoginModal) {
            body?.classList.add("overflow-hidden");
        } else {
            body?.classList.remove("overflow-hidden");
        }
    }, [openLoginModal]);

    useEffect(() => {
        setLoading(false);
    }, [session]);

    useEffect(() => {
        const handleScroll = () => {
            const headerTag = document.getElementsByTagName("header")[0];

            if (window.scrollY) {
                if (headerTag && !headerTag.className.includes("bg-obsidian/75 backdrop-blur")) {
                    headerTag.className += " bg-obsidian/75 backdrop-blur";
                }
            } else {
                if (headerTag && headerTag.className.includes("bg-obsidian/75 backdrop-blur")) {
                    headerTag.className = headerTag.className.replace(
                        " bg-obsidian/75 backdrop-blur",
                        ""
                    );
                }
            }
        };

        handleScroll();

        const handleDropdownClose = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenMenu(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("click", handleDropdownClose);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("click", handleDropdownClose);
        };
    }, []);

    const handleLoginModal = () => {
        setOpenLoginModal(!openLoginModal);
        if (openLoginModal) {
            setLoading(false);
        }
    };

    const handleOpenMenu = (
        e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
    ) => {
        e.preventDefault();
        setOpenMenu(!openMenu);
    };

    const handleDisplaySearch = () => {
        setShowSearchBox(!showSearchBox);
    };

    const MenuDropdown = () => {
        const dropdownList = ["Profile", "Watchlist", "Favourites", "Sign out"];

        const handleItemClick = (item: string) => {
            switch (item) {
                case "Profile":
                    router.push("/user/profile");
                    break;
                case "Watchlist":
                    router.push("/user/watchlist");
                    break;
                case "Favourites":
                    router.push("/user/favourites");
                    break;
                case "Sign out":
                    setLoading(true);
                    signOut();
                    break;
                default:
                    break;
            }
        };

        const Icon = ({ item }: { item: string }) => {
            switch (item) {
                case "Profile":
                    return <UserCircleIcon style={{ width: "20px", height: "20px" }} />;
                case "Watchlist":
                    return <BookmarkIcon style={{ width: "20px", height: "20px" }} />;
                case "Favourites":
                    return <HeartIcon style={{ width: "20px", height: "20px" }} />;
                case "Sign out":
                    return <ExitIcon style={{ width: "20px", height: "20px" }} />;
                default:
                    return <></>;
            }
        };
        return (
            <ul className="absolute top-[120%] w-[170%] right-0 flex flex-col gap-1 bg-neutral-800 border-neutral-700 border text-neutral-400 text-sm p-[6px] font-medium rounded-xl text-left">
                {dropdownList.map((item) => (
                    <li
                        className="py-2 px-4 rounded-md flex items-center gap-2 hover:bg-neutral-700 hover:text-neutral-50"
                        onClick={() => handleItemClick(item)}
                        key={item}
                    >
                        <Icon item={item} />
                        {item}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <header className="z-50 top-0 left-1/2 right-0 -translate-x-1/2 fixed w-full px-4 md:px-10 3xl:px-2 py-4">
                <div className="w-full max-w-[1800px] mx-auto flex justify-between items-center max-h-20">
                    <div className="flex md:gap-5 lg:gap-10 items-center">
                        <Link href="/">
                            <Logo width={150} height={50} />
                        </Link>
                        <div id="searchbox" className="hidden md:block">
                            <SearchBox />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="lg:hidden" onClick={handleDisplaySearch}>
                            <MagnifyingGlassIcon
                                width={30}
                                height={30}
                                className={showSearchBox ? "stroke-primary" : ""}
                            />
                        </div>
                        {status === "authenticated" && !isDataEmptyorUndefined(session) ? (
                            <button
                                className="flex items-center gap-1 border-neutral-700 border pl-4 pr-2 py-[6px] rounded-full transition-all hover:border-neutral-600 hover:shadow-[#525252_0px_0px_0px_2px] relative bg-obsidian/50"
                                onClick={handleOpenMenu}
                                ref={dropdownRef}
                            >
                                {userData?.image && (
                                    <Image
                                        src={userData.image as string}
                                        alt="profile-image"
                                        width={35}
                                        height={35}
                                        className="rounded-full h-[35px] object-cover"
                                    ></Image>
                                )}
                                <p className="font-semibold flex items-center gap-[6px] text-neutral-200">
                                    {userData?.name?.split(" ")[0] || userData?.username}
                                    <TriangleDownIcon className="w-5 h-5" />
                                </p>
                                {openMenu && <MenuDropdown />}
                            </button>
                        ) : (
                            <Button
                                variant="secondary"
                                className="bg-primary font-semibold hover:bg-primary/80 hover:scale-105"
                                onClick={handleLoginModal}
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
                {showSearchBox && (
                    <div className="w-full mt-2 flex items-center justify-center md:hidden">
                        <SearchBox />
                    </div>
                )}
            </header>
            {openLoginModal && <LoginModal closeLoginModal={handleLoginModal} />}
        </>
    );
};

export default Header;
