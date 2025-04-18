import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatContext } from './ChatContext';

export const ChatTabsContext = createContext();

export const ChatTabsProvider = ({ children }) => {
    // Get chat functions from ChatContext
    const { clearChatHistory, endSession, userMessages } = useContext(ChatContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const [activeTabs, setActiveTabs] = useState(() => {
        const storedTabs = localStorage.getItem('activeTabs');
        return storedTabs ? JSON.parse(storedTabs) : [];
    });

    const [activeTabId, setActiveTabId] = useState(() => {
        return location.pathname.startsWith('/user/') ? location.pathname.split('/')[2] : 'general';
    });

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [tabToClose, setTabToClose] = useState(null);
    const transitionTimeoutRef = useRef(null);

    const safeTransition = useCallback((callback, duration = 300) => {
        if (isTransitioning) return false;

        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }

        setIsTransitioning(true);

        callback();

        transitionTimeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
            transitionTimeoutRef.current = null;
        }, duration);

        return true;
    }, [isTransitioning]);

    const hasHistory = useCallback((userId) => {
        if (userId === 'general') {
            return userMessages.general && userMessages.general.length > 1;
        }
        return userMessages[userId] && userMessages[userId].length > 1;
    }, [userMessages]);

    const switchToGeneralTab = useCallback(() => {
        if (activeTabId === 'general') return;

        safeTransition(() => {
            setActiveTabId('general');
            navigate('/');
        });
    }, [activeTabId, navigate, safeTransition]);

    const switchToTab = useCallback((userId) => {
        if (userId === activeTabId) return;

        safeTransition(() => {
            if (userId === 'general') {
                switchToGeneralTab();
            } else {
                const userToSelect = activeTabs.find(tab => tab._id === userId);
                if (userToSelect) {
                    setActiveTabId(userId);
                    navigate(`/user/${userId}`);
                }
            }
        });
    }, [activeTabId, activeTabs, navigate, safeTransition, switchToGeneralTab]);

    const handleCloseTab = useCallback((e, userId) => {
        e.stopPropagation();
        setTabToClose(userId);
        setShowConfirmDialog(true);
    }, []);

    const confirmCloseTab = useCallback(() => {
        if (!tabToClose) return;

        safeTransition(() => {
            const tabIndex = activeTabs.findIndex(tab => tab._id === tabToClose);
            const updatedTabs = activeTabs.filter(tab => tab._id !== tabToClose);

            localStorage.removeItem(`promptGiven_${tabToClose}`);
            localStorage.removeItem(`sessionStarted_${tabToClose}`);
            clearChatHistory(tabToClose);
            endSession(tabToClose);

            if (activeTabId === tabToClose) {
                if (updatedTabs.length > 0) {
                    let nextTabIndex = tabIndex;
                    if (nextTabIndex >= updatedTabs.length) {
                        nextTabIndex = updatedTabs.length - 1;
                    }

                    const nextTab = updatedTabs[nextTabIndex];
                    setActiveTabId(nextTab._id);
                    navigate(`/user/${nextTab._id}`);
                } else {
                    setActiveTabId('general');
                    navigate('/');
                }
            }

            setActiveTabs(updatedTabs);
            setShowConfirmDialog(false);
            setTabToClose(null);
        });
    }, [activeTabId, activeTabs, tabToClose, navigate, safeTransition, clearChatHistory, endSession]);

    const cancelCloseTab = useCallback(() => {
        setShowConfirmDialog(false);
        setTabToClose(null);
    }, []);

    const addTab = useCallback((user) => {
        if (!activeTabs.find(tab => tab._id === user._id)) {
            setActiveTabs(prev => [...prev, user]);
            localStorage.setItem(`sessionStarted_${user._id}`, "true");
        }
    }, [activeTabs]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            localStorage.setItem('activeTabs', JSON.stringify(activeTabs));
        }, 300);

        return () => clearTimeout(debounce);
    }, [activeTabs]);

    useEffect(() => {
        if (isTransitioning) return;

        const isUserRoute = location.pathname.startsWith('/user/');

        if (isUserRoute) {
            const userId = location.pathname.split('/')[2];
            const userTab = activeTabs.find(tab => tab._id === userId);
            if (userTab) {
                setActiveTabId(userId);
            }
        } else if (location.pathname === '/') {
            setActiveTabId('general');
        }
    }, [location.pathname, activeTabs, isTransitioning]);

    return (
        <ChatTabsContext.Provider value={{
            activeTabId,
            activeTabs,
            isTransitioning,
            showConfirmDialog,
            tabToClose,
            hasHistory,
            switchToGeneralTab,
            switchToTab,
            handleCloseTab,
            confirmCloseTab,
            cancelCloseTab,
            addTab
        }}>
            {children}
        </ChatTabsContext.Provider>
    );
};

export const useChatTabs = () => useContext(ChatTabsContext);