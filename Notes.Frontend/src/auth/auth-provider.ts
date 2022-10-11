import React, { FC, useEffect, useRef } from "react";
import { User, UserManager } from "oidc-client";
import { setAuthHeader } from "./auth-headers";

type AuthProviderProps = {
    userManager: UserManager;
    children: React.ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({
    userManager: manager,
    children,
}): any => {
    let userManager = useRef<UserManager>();
    useEffect(() => {
        userManager.current = manager;
        const onUserLoaded = (user: User) => {
            console.log("User loaded: ", user);
            setAuthHeader(user.access_token);
        };
        const onUserUnloaded = () => {
            setAuthHeader(null);
            console.log("User unloaded");
        };
        const onAccesTokenExpiring = () => {
            console.log("User token exprining");
        };
        const onAccesTokenExpired = () => {
            console.log("User token exprined");
        };
        const onUserSignedOut = () => {
            console.log("User signed out");
        };

        userManager.current.events.addUserLoaded(onUserLoaded);      
        userManager.current.events.addUserUnloaded(onUserUnloaded);      
        userManager.current.events.addAccessTokenExpiring(onAccesTokenExpiring);
        userManager.current.events.addAccessTokenExpired(onAccesTokenExpired);
        userManager.current.events.addUserSignedOut(onUserSignedOut);

        return function cleanup() {
            if (userManager && userManager.current) {
                userManager.current.events.removeUserLoaded(onUserLoaded);
                userManager.current.events.removeUserUnloaded(onUserUnloaded);      
                userManager.current.events.removeAccessTokenExpiring(onAccesTokenExpiring);
                userManager.current.events.removeAccessTokenExpired(onAccesTokenExpired);
                userManager.current.events.removeUserSignedOut(onUserSignedOut);
            }
        };
    }, [manager]);

    return React.Children.only(children);
};

export default AuthProvider;