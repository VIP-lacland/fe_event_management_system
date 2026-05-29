import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../../../services/NotificationService';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch initial notifications on mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await NotificationService.getNotifications();
            setNotifications(response.data.data || []);
            setUnreadCount(response.unread_count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications(); // Refresh when opening
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read_at) {
            try {
                await NotificationService.markAsRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(notifications.map(n => 
                    n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
                ));
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
        
        // Navigate to the relevant event
        if (notification.data && notification.data.event_id) {
            setIsOpen(false);
            navigate(`/events/${notification.data.event_id}`);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await NotificationService.markAllAsRead();
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button className="notification-bell-btn" onClick={toggleDropdown}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={handleMarkAllRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="notification-list">
                        {loading && notifications.length === 0 ? (
                            <div className="notification-empty">Loading...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-content">
                                        <p className="notification-message">
                                            {notification.data?.message || 'New notification received'}
                                        </p>
                                        <span className="notification-time">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    {!notification.read_at && <span className="unread-dot"></span>}
                                </div>
                            ))
                        ) : (
                            <div className="notification-empty">
                                No notifications yet
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
