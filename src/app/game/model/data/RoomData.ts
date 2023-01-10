import { MonsterType } from "../MonsterType";
import { ObjectiveData } from "./ObjectiveData";

export class RoomData {
    roomNumber: number = 0;
    ref: string = "";
    initial: boolean = false;
    marker: string = "";
    rooms: number[] = [];
    treasures: number[] = [];
    monster: MonsterStandeeData[] = [];
    allies: string[] = [];
    objectives: ObjectiveData[] = [];
}

export class MonsterStandeeData {
    name: string = "";
    type: MonsterType | undefined;
    player2: MonsterType | undefined;
    player3: MonsterType | undefined;
    player4: MonsterType | undefined;
}