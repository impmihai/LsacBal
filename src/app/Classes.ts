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
    infoVisible: Boolean = false;
}

export class AccountInfo {
    id: string;
    displayName: string;
    voteStatus: number;
    displayImages: string[];
}

export class Message {
    sender: string;
    receiver: string;
    type: MessageType;
    message: string;
}

export class TinderProfile {
    id: string;
    displayName: string;
    description: string;
    displayImages: string[];
}

export class TinderPerson {
    id: string;
    profile: TinderProfile;
}