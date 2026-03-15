import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatMessage {
    sender: string;
    message: string;
    timestamp: Time;
}
export interface GroupStatus {
    name: string;
    isLive: boolean;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    endLive(groupName: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGroups(): Promise<Array<GroupStatus>>;
    getMessages(groupName: string): Promise<Array<ChatMessage>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    goLive(groupName: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(groupName: string, senderName: string, message: string): Promise<void>;
    verifyPasscode(pass: string): Promise<boolean>;
}
