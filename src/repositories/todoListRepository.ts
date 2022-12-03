import { DynamoDB } from 'aws-sdk';

let options = {
    region: process.env.REGION,
    endpoint: process.env.DYNAMODB
};
// test push from macbook pro BE sln

let dynamoDB = new DynamoDB.DocumentClient(options);

export class todoListRepository {
    
    public getToDoList(): Promise<any> {
        var params = {
            TableName: "ToDoList",
            ProjectionExpression: "#ID, #DateDue, #No, #TaskDescription, #Status, #TaskAssigned",
            HashKey: "#ID",
            ExpressionAttributeNames: {
                "#ID": "ID",
                "#DateDue": "DateDue",
                "#No": "No",
                "#TaskDescription": "TaskDescription",
                "#Status": "Status",
                "#TaskAssigned": "TaskAssigned"
            },
        };
        let request = dynamoDB.scan(params).promise();
        return request.then((res) => {
            return res;
        }).catch((rej) => {
            return rej["message"];
        });
    }

    public getListByNo(no: String): Promise<any> {
        var params = {
            TableName: "ToDoList",
            ProjectionExpression: "#ID, #DateDue, #No, #TaskDescription, #Status, #TaskAssigned",
            FilterExpression: "#No = :no",
            HashKey: "#ID",
            ExpressionAttributeNames: {
                "#ID": "ID",
                "#DateDue": "DateDue",
                "#No": "No",
                "#TaskDescription": "TaskDescription",
                "#Status": "Status",
                "#TaskAssigned": "TaskAssigned"
            },
            ExpressionAttributeValues: {
                ':no': Number(no)
            }
        };
        let request = dynamoDB.scan(params).promise();
            return request.then((res) => {
                return res;
            }).catch((rej) => {
                return rej["message"];
        });
    }

    public addToDoList(id: string, dtDue: String, no: String, status: String, taskAssingd: String, taskDesc: String): Promise<any> { 
        var params = {
            TableName: "ToDoList",
            Item:{
                ID: Number (id),
                DateDue: dtDue ,
                No: Number(no),
                Status: status,
                TaskAssigned: taskAssingd,
                TaskDescription: taskDesc
            }
        };
        let request = dynamoDB.put(params).promise();
            return request.then((res) => {
                console.info('successfully inserted', res);
                return res;
            }).catch((rej) => {
                console.info('failed to add record', rej)
                return rej["message"];
        });
    }

    public updateToDoList(id: string, dtDue: String, no: String, status: String, taskAssingd: String, taskDesc: String): Promise<any> { 
        var params = {
            TableName: "ToDoList",
            Item:{
                ID: Number (id),
                DateDue: dtDue ,
                No: Number(no),
                Status: status,
                TaskAssigned: taskAssingd,
                TaskDescription: taskDesc
            }
        };
        let request = dynamoDB.put(params).promise();
            return request.then((res) => {
                console.info('successfully updated', res);
                return res;
            }).catch((rej) => {
                console.info('failed to update record', rej)
                return rej["message"];
        });
    }

    public deletToDoList(id: string): Promise<any> { 
        var params = {
            Key:{
                 ID: Number(id),
            },
            TableName: "ToDoList",
        };
        let request = dynamoDB.delete(params).promise();
            return request.then((res) => {
                console.info('successfully deleted', res);
                return res;
            }).catch((rej) => {
                console.info('failed to delete record', rej)
                return rej["message"];
        });
    }
}
