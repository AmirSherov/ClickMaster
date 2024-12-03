'use client';
import './userinfo.scss';
import { MdAccountCircle } from "react-icons/md";

export default function UserInfo() {
    return (
        <div className="user-info-container">
            <button className="user-info-button">
            Olimxon
            <MdAccountCircle />
            </button>
        </div>
    );
}