import './userinfo.scss';
import { MdAccountCircle } from "react-icons/md";
import { useGlobalContext } from '../GlobalState';
export default function UserInfo() {
    const { state } = useGlobalContext();
    function capitalizeWords(str) {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return (
        <div className="user-info-container">
            <button className="user-info-button">
                {capitalizeWords(state.userName)}
                <MdAccountCircle />
            </button>
        </div>
    );
}