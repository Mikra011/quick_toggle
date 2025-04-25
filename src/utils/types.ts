export interface Extension {
    id: string;
    name: string;
    enabled: boolean;
    type: string;
    mayDisable: boolean;
    icons?: { size: number; url: string }[];
}

export type GroupMap = {
    [groupName: string]: string[];
};