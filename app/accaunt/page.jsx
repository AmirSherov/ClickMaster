'use client';
import Nav from '../nav';
import './accaunt.scss';
import { useGlobalContext } from '../GlobalState';
export default function Account() {
    const { state } = useGlobalContext();
    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart.slice(0, 2) + '**'; 
        return `${maskedLocalPart}@${domain}`;
    };

    return (
        <div className="account-container">
            <h1>Account Information</h1>
            <div className="user-details">
                <p><strong>Username:</strong>{state.userName}</p>
                <p><strong>Registration Date:</strong>{state.date}</p>
                <p><strong>Email:</strong> <span className="email-mask">{maskEmail(state.email)}</span></p>
            </div>
            <Nav />
        </div>
    );
}
