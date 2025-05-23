import { createContext, useState } from 'react';

export const UserContext = createContext({});

//Context provider component to wrap around parts of the app that need user data
export function UserContextProvider({children}) {
    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    );
}