'use client';
import { useEffect, useState } from "react";
import { getTopUsers } from "../api";
import "./rating.scss";
import { IoStar } from "react-icons/io5";
import { useGlobalContext } from "../GlobalState";
import Nav from "../nav";
export default function Rating() {
    const [users, setUsers] = useState([]);
    const { state } = useGlobalContext();

    async function topUsers() {
        const topUsers = await getTopUsers();
        setUsers(topUsers);
    }

    useEffect(() => {
        topUsers();
    }, []);

    return (
        <>
            <div className="rating-wrapper">
                <div className="rating-page-container">
                    <div className="rating-text-container">
                        <h1>Users Rating <IoStar style={{ color: "yellow" }} /></h1>
                        <h3>Here will be top 100 users with the most clicks</h3>
                    </div>
                    <div className="rating-info">
                        <div>Rating:</div>
                        <div>Balance:</div>
                        <div>Username:</div>
                    </div>
                    <div className="users-container">
                        {users.map((user, index) => (
                            <div className={user.email === state.email ? "rating-user active" : "rating-user"} key={user.id}>
                                <p>{user.username}</p>
                                <p>{user.count}</p>
                                <p>{index + 1}#</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Nav />
        </>
    );
}

