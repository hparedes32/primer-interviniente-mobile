export class Intervention{
    id: string
    location: string;
    observation: string;
    imageUrl: string;
    type: string;
    recordings: string;
    createdOn: string;
    userId: string;

    constructor(observation: string, location: string, imageUrl: string, type: string, recordings: string, createdOn: string, userId: string, id: string){
        this.id = id;
        this.observation = observation;
        this.location = location;
        this.imageUrl = imageUrl;
        this.type = type;
        this.createdOn = createdOn;
        this.recordings = recordings;
        this.userId = userId;
    }
}