import { Task } from "./task.model";

export class Column {
    _id: string;
    title: string;
    position: number;
    tasks: Task[];
    isTitleSelected: boolean;
}