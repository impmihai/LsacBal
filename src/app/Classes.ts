export enum Sex {
    boy = 0,
    girl = 1
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
}