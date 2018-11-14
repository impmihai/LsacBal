import { Observable } from "rxjs";

export enum Sex {
    boy = 0,
    girl = 1
}

export enum MessageType {
    RECEIVED = 0,
    SENT = 1
}

export class VotePerson {
    id: string;
    displayName: string;
    displayImage: string;
    description: string;
    index: Number;
    votesCount: Number;
    infoVisible: Boolean = false;
}

export class AccountInfo {
    id: string;
    description: string;
    displayName: string;
    voteStatus: number;
    tomboleStatus: number;
    displayImages: string[];
    likesCount: number = 0;
    raspuns: any = null;
}

export class Message {
    sender: string;
    type: MessageType;
    message: string;
}

export class TinderProfile {
    id: string;
    displayName: string;
    description: string;
    displayImages: string[];
}

export class Tombola {
    id: number;
    displayName: string;
    mediaType: string;
    mediaUrl: string;
    description: string;
    couponUrl: string;
    theText: string;
    requiredFields: string[];
}

export class TinderPerson {
    id: string;
    profile: TinderProfile;
}

export class Conversation {
    id: string;
    otherPerson: TinderProfile;
}