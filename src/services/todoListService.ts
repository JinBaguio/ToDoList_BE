import { todoListRepository } from '../repositories/todoListRepository';


export class todoListService {
    private todoListRepo = new todoListRepository();
    
    constructor() {

    }    

    public getToDoList(): Promise<any> {
        return this.todoListRepo.getToDoList();
    }

    public getListByNo(no: string): Promise<any> {
        return this.todoListRepo.getListByNo(no);
    }

    public addToDoList(id: string, dtDue: string, no: string, status: string, taskAssingd: string, taskDesc: string): Promise<any> {
        return this.todoListRepo.addToDoList(id, dtDue, no, status, taskAssingd, taskDesc);
    }

    public updateToDoList(id: string, dtDue: string, no: string, status: string, taskAssingd: string, taskDesc: string): Promise<any> {
        return this.todoListRepo.updateToDoList(id, dtDue, no, status, taskAssingd, taskDesc);
    }

    public deletToDoList(id: string): Promise<any> {
        return this.todoListRepo.deletToDoList(id);
    }
}
