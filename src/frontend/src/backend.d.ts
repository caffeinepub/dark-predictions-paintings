import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type PaintingId = string;
export interface Painting {
    id: PaintingId;
    title: string;
    description: string;
    contactEmail: string;
    price: Price;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
}
export type Price = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPainting(id: PaintingId, title: string, description: string, price: Price, images: Array<ExternalBlob>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePainting(id: PaintingId): Promise<void>;
    getAllPaintings(): Promise<Array<Painting>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactEmail(): Promise<string>;
    getPainting(id: PaintingId): Promise<Painting | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePainting(id: PaintingId, updatedTitle: string, updatedDescription: string, updatedPrice: Price, updatedImages: Array<ExternalBlob>): Promise<void>;
}
